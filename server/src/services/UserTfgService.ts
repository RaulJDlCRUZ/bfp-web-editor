/* As the creation of a new user includes a new TFG, assume a Postgres Transaction: handled in service layer */
// import { BaseService } from "./BaseService";
import path from "path";
import {
  DatabaseConnection,
  Transaction,
} from "../../database/config/dbConnection";

import { UserRepository } from "../models/repositories/UserRepository";
import { TfgRepository } from "../models/repositories/TfgRepository";

import { AcronymService } from "./AcronymService";
import { AppendixService } from "./AppendixService";
import { BasicInfoService } from "./BasicInfoService";
import { TfgService } from "./TfgService";
import { UserService } from "./UserService";
import { ChapterService } from "./ChapterService";
import { ImageService } from "./ImageService";

import { ChapAppxService } from "./ChapAppxService";

import { TfgFormData } from "../shared/types/TfgFormData";
import { UserFormData } from "../shared/types/UserFormData";
import { constructTFGData } from "../shared/types/ConstructTFGData";

import { User } from "../models/entities/User";
import { Tfg } from "../models/entities/Tfg";
import { Acronym } from "../models/entities/Acronym";
import { Appendix } from "../models/entities/Appendix";
import { BasicInfo } from "../models/entities/BasicInfo";
import { Chapter } from "../models/entities/Chapter";
import { Image } from "../models/entities/Image";

import { fetchTemplate } from "../utils/fetchTemplate";

import { root, inputdir } from "../app";

export class UserTfgService {
  private acronymService: AcronymService;
  private basicInfoService: BasicInfoService;
  private chapterService: ChapterService;
  private appendixService: AppendixService;
  private chapAppxService: ChapAppxService;
  private imageService: ImageService;
  private userService: UserService;
  private userRepository: UserRepository;
  private tfgService: TfgService;
  private tfgRepository: TfgRepository;
  private db: DatabaseConnection;
  constructor() {
    this.acronymService = new AcronymService();
    this.basicInfoService = new BasicInfoService();
    this.chapterService = new ChapterService();
    this.appendixService = new AppendixService();
    this.chapAppxService = new ChapAppxService();
    this.imageService = new ImageService();
    this.userService = new UserService();
    this.userRepository = new UserRepository();
    this.tfgService = new TfgService();
    this.tfgRepository = new TfgRepository();
    this.db = new DatabaseConnection(); // Initialize the db property
  }

  async constructTFG(): Promise<constructTFGData> {
    try {
      // Define all paths based on the root and inputdir
      const tfggii_dir = path.join(root, inputdir);
      const chapters_path = path.join(tfggii_dir, "chapters");
      const appendices_path = path.join(tfggii_dir, "appendices");
      const resources_path = path.join(tfggii_dir, "resources", "images");
      const bib_path = path.join(tfggii_dir, "resources", "bibliography");
      const config_path = path.join(tfggii_dir, "..");

      // Fetch the template
      await fetchTemplate();

      // Read all resources
      const recordchapters: Record<number, { title: string; content: string }> =
        await this.chapAppxService.readInputFiles(chapters_path);
      const recordappendices: Record<
        number,
        { title: string; content: string }
      > = await this.chapAppxService.readInputFiles(appendices_path);
      const setupFiles: Record<string, any> =
        await this.basicInfoService.readSetupFiles(tfggii_dir);
      const resources: Record<string, any> =
        await this.imageService.readResources(resources_path);
      const config: Record<string, any> =
        await this.tfgService.readConfigFile(config_path);
      const bibliography: string = await this.basicInfoService.readBibFile(
        bib_path
      );

      return {
        chapters: recordchapters,
        appendices: recordappendices,
        setupFiles,
        resources,
        config,
        bibliography,
      };
    } catch (error) {
      console.error("Error constructing TFG data:", error);
      throw error;
    }
  }

  /**
   * Este método inicializa los recursos base de un TFG recién creado.
   * Se encarga de definir acrónimos, capítulos...
   * Este método se invoca después de crear un nuevo TFG.
   * @param bfp_id El ID del TFG que se está inicializando.
   */
  async inicializeNewTfg(bfp_id: number, student: number): Promise<void> {
    const trx: Transaction = await this.db.beginTransaction();
    try {
      const data: constructTFGData = await this.constructTFG();
      if (!data) {
        throw new Error("Failed to construct TFG data.");
      }
      const chapters = data.chapters;
      const appendices = data.appendices;
      const setup = data.setupFiles;
      const acronyms = this.acronymService.parseAcronymFile(setup.acronyms);
      const res = data.resources;
      const cfg = data.config;
      const bib = data.bibliography;

      const defaultCslFile = cfg.Csl
        ? cfg.Csl.split("/").pop().split(".")[0]
        : null;

      let actualTfg = await this.tfgService.findById(bfp_id);
      if (actualTfg && actualTfg.csl !== defaultCslFile && defaultCslFile) {
        // If the CSL file is not the default, update it, priorizing the default config file

        // Update TFG with default CSL file (through TfgService)
        const updatedTfg = await this.tfgService.updateCslTfg(
          bfp_id,
          defaultCslFile
        );

        if (!updatedTfg || !updatedTfg.bfp_id) {
          throw new Error("Failed to update TFG with default CSL file.");
        }

        actualTfg = updatedTfg; // Update the reference to the actual TFG
      }

      let basicInfo = new BasicInfo(
        bfp_id,
        "cfg_" + student, // cfg_id == user_id FOR THE MOMENT
        setup.abstract,
        setup.acknowledgements,
        setup.authorship,
        setup.dedication,
        setup.resumen,
        bib
      );

      basicInfo = await this.basicInfoService.createBasicInfo(basicInfo);

      if (!basicInfo || !basicInfo.bfp_id) {
        throw new Error("Failed to create basic info for TFG.");
      }

      // Initialize acronyms
      for (const [acronym, meaning] of Object.entries(acronyms)) {
        const newAcronym = new Acronym(
          acronym.trim().toUpperCase(),
          bfp_id,
          meaning.trim()
        );
        await this.acronymService.createNewAcronym(newAcronym);
      }

      // Initialize chapters
      for (const [chapterN, chapterContent] of Object.entries(chapters)) {
        const sanCh: Chapter | Appendix =
          this.chapAppxService.sanitizeInputFile(
            new Chapter(
              "ch",
              chapterContent.title,
              parseInt(chapterN),
              false,
              chapterContent.content,
              bfp_id
            )
          );

        const newChapter = await this.chapterService.create(sanCh as Chapter);
        if (!newChapter || !newChapter.chapter_id) {
          throw new Error(`Failed to create chapter ${chapterN}.`);
        }
      }

      // Initialize appendices
      for (const [appxN, appxContent] of Object.entries(appendices)) {
        const sanAppx: Chapter | Appendix =
          this.chapAppxService.sanitizeInputFile(
            new Appendix(
              "ap",
              appxContent.title,
              parseInt(appxN),
              false,
              appxContent.content,
              bfp_id
            )
          );

        const newAppendix = await this.appendixService.create(
          sanAppx as Appendix
        );
        if (!newAppendix || !newAppendix.appx_id) {
          throw new Error(`Failed to create appendix ${appxN}.`);
        }
      }

      // Insert default images
      for (const [filename, content] of Object.entries(res)) {
        const imageData = new Image(filename, content, bfp_id);
        const newImage = await this.imageService.createNewImage(imageData);
        if (!newImage || !newImage.img_id) {
          throw new Error(`Failed to create image ${filename}.`);
        }
      }
    } catch (error) {
      console.error("Error while inicialization of TFG data:", error);
      await trx.rollback();
      throw error;
    }
  }

  /**
   * Este método crea un nuevo usuario con TFG asociado en la base de datos.
   * Si la creación de cualquiera de los dos falla, se revierte la transacción.
   * Si es exitoso, se inicializa el TFG con recursos base, devolviendo, al final, la referencia al usuario y TFG creados.
   * @param userData
   * @param tfgData
   * @returns an object containing the created user and TFG.
   * @throws Error if user or TFG creation fails.
   */
  async createUserWithTfg(
    userData: UserFormData,
    tfgData: TfgFormData
  ): Promise<{ user: User; tfg: Tfg }> {
    // Start a transaction
    const trx: Transaction = await this.db.beginTransaction();
    try {
      // Create user
      if (!userData || !tfgData) {
        throw new Error("Missing user data or TFG data");
      }
      // Create a new user using the UserRepository
      // const userDataConverted: Partial<User> = {
      //   ...userData,
      //   user_id: undefined, // Ensure user_id is not set initially
      // };
      // console.log(userDataConverted);
      // const user: User = await this.userRepository.create(userDataConverted);

      const user: User = await this.userService.createNewUser(userData);
      const userId = user.user_id;

      if (!user || !userId) {
        throw new Error("Failed to create new user.");
      }

      // Create TFG associated with the user
      // const tfgDataConverted: Partial<Tfg> = {
      //   ...tfgData,
      //   bfp_id: undefined, // Ensure bfp_id is not set initially
      //   student: user.user_id, // Associate TFG with the created user
      // };
      // const tfg: Tfg = await this.tfgRepository.create({
      //   ...tfgDataConverted,
      // });

      const tfg: Tfg = await this.tfgService.createNewTfg(
        tfgData,
        userId // Pass userId as the second argument
      );

      if (!tfg || !tfg.bfp_id) {
        throw new Error("Failed to create new TFG.");
      }

      // Commit the transaction
      await trx.commit();
      console.log("User and TFG created successfully and COMMIT", user, tfg);
      // A partir de aquí, se inicializará, usando recursos base de la plantilla
      await this.inicializeNewTfg(tfg.bfp_id, tfg.student);
      // await trx.release();
      console.log("[¡¡]TFG initialized successfully with base resources[!!]");
      return { user, tfg };
    } catch (error) {
      // Rollback the transaction in case of error
      await trx.rollback();
      console.error("Error creating user and TFG:", error);
      throw error;
    }
  }

  async materializeFromUser(user_id: number) {
    try {
      // Fetch user object by user_id
      const user: User | null = await this.userService.findById(user_id);
      if (!user || !user.user_id) {
        throw new Error(`User with ID ${user_id} not found.`);
      }

      // Find TFG by user ID
      const tfg: Tfg = await this.tfgService.findByStudentId(user.user_id);
      if (!tfg || !tfg.bfp_id) {
        throw new Error(`TFG for user with ID ${user_id} not found.`);
      }

      // Find basic info
      const basicInfo: BasicInfo | null =
        await this.basicInfoService.getBasicInfoById(tfg.bfp_id);

      if (!basicInfo || !basicInfo.bfp_id) {
        throw new Error(`Basic info for TFG with ID ${tfg.bfp_id} not found.`);
      }

      // Find chapters
      const chapters: Chapter[] = await this.chapterService.findAll(tfg.bfp_id);

      // Fin appendices
      const appendices: Appendix[] = await this.appendixService.findAll(
        tfg.bfp_id
      );

      // Find acronyms
      const acronyms: Acronym[] = await this.acronymService.findAll(tfg.bfp_id);

      // Find images
      const images: Image[] = await this.imageService.getAllImages(tfg.bfp_id);
    } catch (error) {
      console.error("Error materializing user and TFG data:", error);
      throw error;
    }
  }
}
