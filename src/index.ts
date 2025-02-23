import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { execSync, spawn } from 'child_process';
import path from "path";
import cors from "cors";

dotenv.config({ override: true });

const app: Express = express();
const port = process.env.PORT || 5000;
const docdir = process.env.RESFILEPATH || 'output';
const file = process.env.RESFILENAMEDEF || 'tfgii.pdf';

app.use(cors());

// Middleware para servir archivos estáticos desde un directorio específico
app.use('/result', express.static(path.join(__dirname, docdir)));

app.get("/", (_req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.get('/ejecutar-comando', (req, res) => {
    console.debug('Iniciando ejecución de make...');

    // Directorio donde está el Makefile
    const directorioMakefile = process.env.MAKEPATH || 'makefiles';

    // Crear proceso make
    const makeProcess = spawn('make', [], {
        cwd: directorioMakefile,
        shell: true
    });

    let outputCompleto = '';

    // Capturar salida estándar
    makeProcess.stdout.on('data', (data) => {
        const output = data.toString();
        outputCompleto += output;
        console.debug(output);
    });

    // Capturar salida de error
    makeProcess.stderr.on('data', (data) => {
        const error = data.toString();
        outputCompleto += error;
        console.error(error);
    });

    // Manejar finalización del proceso
    makeProcess.on('close', (code) => {
        console.log(`Proceso make finalizado con código: ${code}`);
        // console.log('Output completo:', outputCompleto);
        res.json({ result: outputCompleto, pdf: '/servir-pdf' });
    });

    // Manejar errores del proceso
    makeProcess.on('error', (error) => {
        console.error('Error al ejecutar make:', error);
        res.status(500).json({ error: (error as Error).message });
    });
});

app.get('/ejecutar-comando-legacy', (_req, res) => {
    try {
        // console.debug("[D] " + docdir + '/' + file);
        const sanitizedDocdir = path.resolve(docdir);
        // const sanitizedFile = path.basename(file);
        const output = execSync('ls', { encoding: 'utf-8', cwd: sanitizedDocdir });
        console.debug("[D] " + output);
        res.json({ result: output, pdf: '/servir-pdf' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message }); // Error como tipo error (TS)
    }
});

// Ruta específica para servir el PDF
app.get('/servir-pdf', (req, res) => {
    res.sendFile(path.resolve(docdir) + '/' + file, (err) => {
        if (err) {
            console.error('Error al enviar el archivo:', err);
            res.status(404).send('Archivo no encontrado');
        }
    });
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});