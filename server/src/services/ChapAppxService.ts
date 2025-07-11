/* This file is meant for managing services compatible with both Chapters and Appendices.*/
// import { BaseService } from "./BaseService";

import { ChapterService } from "./ChapterService";
import { AppendixService } from "./AppendixService";

import fs from "fs/promises";
import path, { parse } from "path";

import { Appendix } from "../models/entities/Appendix";
import { Chapter } from "../models/entities/Chapter";

export class ChapAppxService {
  private chapterService: ChapterService;
  private appendixService: AppendixService;

  constructor() {
    this.chapterService = new ChapterService();
    this.appendixService = new AppendixService();
  }

  /**
   * Parses a markdown file content to extract the title and body.
   * The first line is expected to be the title, prefixed with "# ".
   * The rest of the content is considered the body.
   *
   * @param content - The markdown file content as a string.
   * @returns An object containing the title and content.
   */
  parseMarkdownFile(content: string) {
    const [titleLine, ...rest] = content.split("\n");
    const title = titleLine.replace(/^# /, "");
    const body = rest.join("\n").trim();

    return {
      title,
      content: body,
    };
  }

  /**
   * Reads markdown files from a specified directory and parses them. Compatible with chapters and appendices.
   * @param dst_path - The path to the directory containing markdown files (chapters or appendices).
   * @returns An object where keys are chapter/appendix numbers and values are objects containing the number and parsed data.
   */
  async readInputFiles(
    dst_path: string
  ): Promise<Record<number, { title: string; content: string }>> {
    const files = await fs.readdir(dst_path);
    const registers: Record<number, { title: string; content: string }> = {};
    for (const file of files) {
      if (file.endsWith(".md")) {
        const number = parseInt(
          path.basename(file, path.extname(file)).slice(0, 2)
        );
        const filedata = await fs.readFile(path.join(dst_path, file), "utf-8");
        const parsedMdData: { title: string; content: string } =
          this.parseMarkdownFile(filedata);
        registers[number] = parsedMdData;
      }
    }
    return registers;
  }

  /**
   * Improves de Chapter or Appendix data by improving existing or missing fields.
   * This function generates a unique ID based on the title and other properties.
   * @param data - The Chapter or Appendix data to sanitize (accept both).
   * @return A sanitized Chapter or Appendix object with a unique ID and other fields set.
   * @throws Error if the data type is invalid.
   */
  sanitizeInputFile(data: Chapter | Appendix): Chapter | Appendix {
    const infix = data instanceof Chapter ? "_ch_" : "_ap_";
    const content = data.content;
    const dbNumber = data.number * 10; // This will help to swap values
    const bfpid = data.tfg;
    const complete_title =
      data instanceof Chapter ? data.ch_title : data.ap_title;
    const title_lc = complete_title.toLowerCase().replace(/\s+/g, "_");
    const fullId = (bfpid + infix + title_lc).slice(0, 64);

    switch (data.constructor) {
      case Chapter:
        return new Chapter(
          fullId,
          complete_title,
          dbNumber,
          false, // is_omitted default to false
          content,
          bfpid,
          data.original_number ?? undefined // Handle original_number as optional
        );

      case Appendix:
        return new Appendix(
          fullId,
          complete_title,
          dbNumber,
          false, // is_omitted default to false
          content,
          bfpid,
          data.original_number ?? undefined // Handle original_number as optional
        );
      default:
        throw new Error("Invalid data type provided for sanitization.");
    }
  }
}
