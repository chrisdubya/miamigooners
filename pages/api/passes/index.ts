import { Template } from "@walletpass/pass-js";
import fs from 'fs';
import path from 'path';

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        const template = new Template("coupon", {
            passTypeIdentifier: "pass.com.miamigooners.node",
            teamIdentifier: "S3K8RWSVKB",
            backgroundColor: "red",
            sharingProhibited: false,
            organizationName: "Miami Gooners",
        });

        const iconPath = path.join(process.cwd(), 'public', 'favicon-32x32.png');
        const logoPath = path.join(process.cwd(), 'public', 'favicon-32x32.png');

        const iconBuffer = fs.readFileSync(iconPath);
        const logoBuffer = fs.readFileSync(logoPath);

        await template.images.add("icon", iconBuffer);
        await template.images.add("logo", logoBuffer);

        const pemPath = path.join(process.cwd(), 'private/passes', 'signerCert.pem');

        await template.loadCertificate(pemPath, process.env.CERT_PASS);
        
        const pass = template.createPass({
            serialNumber: "123456",
            description: "20% off"
        });

        await pass.asBuffer().then((buffer) => {
            res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
            res.send(buffer);
        }).catch((error) => {
            res.status(500).json({ error: error.message });
        });
    }
}
