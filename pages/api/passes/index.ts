import { Template } from "@walletpass/pass-js";
import fs from 'fs';
import path from 'path';

const CURRENT_SEASON = '23/24';

const generatePassImage = async (imageName: string, imageType: 'logo' | 'icon', template: Template, dimensions: '1x' | '2x' | '3x') => {
    const imagePath = path.join(process.cwd(), 'public/images/wallet-assets', imageName)
    const imageBuffer = fs.readFileSync(imagePath);
    await template.images.add(imageType, imageBuffer, dimensions);
}

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        const template = new Template(
            "generic", 
            {
                passTypeIdentifier: "pass.com.miamigooners.node",
                teamIdentifier: "S3K8RWSVKB",
                backgroundColor: "black",
                foregroundColor: "red",
                labelColor: "white",
                sharingProhibited: true,
                organizationName: "Miami Gooners",
                description: "Miami Gooners Membership Pass",
                generic: {
                    headerFields: [
                        {
                            key: "season",
                            label: "Season",
                            value: CURRENT_SEASON
                        }
                    ],
                    primaryFields: [
                        {
                            key: "memberName",
                            label: "Member",
                            value: req.body.memberName
                        }
                    ],
                    secondaryFields: [
                        {
                            key: "membershipNumber",
                            label: "Member No.",
                            value: req.body.membershipNumber
                        }
                    ],
                }
            }
        );

        await generatePassImage('gooners-wallet-logo.png', 'icon', template, '1x');
        await generatePassImage('gooners-wallet-logo@2x.png', 'icon', template, '2x');
        await generatePassImage('gooners-wallet-logo@3x.png', 'icon', template, '3x');

        await generatePassImage('gooners-wallet-logo.png', 'logo', template, '1x');
        await generatePassImage('gooners-wallet-logo@2x.png', 'logo', template, '2x');
        await generatePassImage('gooners-wallet-logo@3x.png', 'logo', template, '3x');

        if (!process.env.CERT_PEM) {
            throw new Error('Certificate not found');
        }

        template.setCertificate(process.env.CERT_PEM, process.env.CERT_PASS);

        
        const pass = template.createPass({
            serialNumber: "123456",
            description: "Miami Gooners Membership Pass",
        });

        await pass.asBuffer().then((buffer) => {
            res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
            res.send(buffer);
        }).catch((error) => {
            res.status(500).json({ error: error.message });
        });
    }
}
