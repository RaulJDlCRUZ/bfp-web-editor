import express, { application, Express, Request, Response } from "express";
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

function compileDocument(res: Response) {
    const dir = process.env.MAKEPATH || 'makefiles';
    const proc = spawn('make', [], {
        cwd: dir,
        shell: true
    });

    proc.stdout.on('data', (data) => {
        const output = data.toString();
        console.debug(output);
    });

    proc.stderr.on('data', (data) => {
        const error = data.toString();
        console.error(error);
    });

    proc.on('close', (code) => {
        console.log(`make process finished with code: ${code}`);
        res.json({ result: 'Compiled successfully!', pdf: '/servedoc' });
    });

    proc.on('error', (error) => {
        console.error('Error while executing make:', error);
        res.status(500).json({ error: (error as Error).message });
    });
}

// Serve static files from a specific directory (Middleware)
app.use('/result', express.static(path.join(__dirname, docdir)));

app.get("/", (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', '/public/', 'index.html'));
});

app.get('/runcompilation', (req, res) => {
    console.debug('Starting make process...');
    compileDocument(res);
});

// Specific route to serve the PDF file
app.get('/servedoc', (req, res) => {
    res.sendFile(path.resolve(docdir) + '/' + file, (err) => {
        if (err) {
            console.error('Error while sending the file:', err);
            res.status(404).send('File not found');
        }
    });
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});