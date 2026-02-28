import {Template} from '@walletpass/pass-js'
import fs from 'fs'
import path from 'path'

const CURRENT_SEASON = '23/24'

const generatePassImage = async (
  imageName: string,
  imageType: 'logo' | 'icon',
  template: Template,
  dimensions: '1x' | '2x' | '3x'
) => {
  const imagePath = path.join(
    process.cwd(),
    'public/images/wallet-assets',
    imageName
  )
  const imageBuffer = fs.readFileSync(imagePath)
  await template.images.add(imageType, imageBuffer, dimensions)
}

export async function POST(request: Request) {
  const body = await request.json()

  const template = new Template('generic', {
    passTypeIdentifier: 'pass.com.miamigooners.node',
    teamIdentifier: 'S3K8RWSVKB',
    backgroundColor: 'black',
    foregroundColor: 'red',
    labelColor: 'white',
    sharingProhibited: true,
    organizationName: 'Miami Gooners',
    description: 'Miami Gooners Membership Pass',
    generic: {
      headerFields: [
        {
          key: 'season',
          label: 'Season',
          value: CURRENT_SEASON,
        },
      ],
      primaryFields: [
        {
          key: 'memberName',
          label: 'Member',
          value: body.memberName,
        },
      ],
      secondaryFields: [
        {
          key: 'membershipNumber',
          label: 'Member No.',
          value: body.membershipNumber,
        },
      ],
    },
  })

  await generatePassImage(
    'gooners-wallet-logo.png',
    'icon',
    template,
    '1x'
  )
  await generatePassImage(
    'gooners-wallet-logo@2x.png',
    'icon',
    template,
    '2x'
  )
  await generatePassImage(
    'gooners-wallet-logo@3x.png',
    'icon',
    template,
    '3x'
  )

  await generatePassImage(
    'gooners-wallet-logo.png',
    'logo',
    template,
    '1x'
  )
  await generatePassImage(
    'gooners-wallet-logo@2x.png',
    'logo',
    template,
    '2x'
  )
  await generatePassImage(
    'gooners-wallet-logo@3x.png',
    'logo',
    template,
    '3x'
  )

  if (!process.env.CERT_PEM) {
    return Response.json({error: 'Certificate not found'}, {status: 500})
  }

  template.setCertificate(process.env.CERT_PEM, process.env.CERT_PASS)

  const pass = template.createPass({
    serialNumber: '123456',
    description: 'Miami Gooners Membership Pass',
  })

  try {
    const buffer = await pass.asBuffer()
    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition':
          'attachment; filename="membership_pass.pkpass"',
      },
    })
  } catch (error: any) {
    return Response.json({error: error.message}, {status: 500})
  }
}
