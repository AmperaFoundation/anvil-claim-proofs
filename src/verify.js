import { StandardMerkleTree } from '@openzeppelin/merkle-tree'
import { promises as fs } from 'fs'

async function run() {
  const environmentDirs = await fs.readdir(`dist`);
  // Should be "<env>"
  const environments = environmentDirs.map(x => x.toString())

  for (const environment of environments) {
    console.log(`verifying ${environment}`)
    console.log()

    const basePath = `dist/${environment}`
    const root = await fs.readFile(`${basePath}/root`, 'utf-8')
    console.log(`typeof root: ${typeof(root)}, value: ${JSON.stringify(root)}`)
    console.log()

    const proofsDirPath = `${basePath}/proofs`
    const proofFilenames = await fs.readdir(proofsDirPath);

    for (const proofFilename of proofFilenames) {
      // name is <address>.json
      const address = proofFilename.split(".")[0]
      const contents = await fs.readFile(`${proofsDirPath}/${proofFilename}`, 'utf-8')
      // { "amount": "123456", "proof": ["0x...", "0x...", ...] }
      const obj = JSON.parse(contents)

      if (!StandardMerkleTree.verify(root, ['address', 'uint256'], [address, obj.amount], obj.proof)) {
        throw Error(`${proofsDirPath}/${proofFilename} is not a valid proof for root "${root}"!`)
      } else {
        console.log(`verified ${proofsDirPath}/${proofFilename}`)
      }
    }
  }
  console.log()
  console.log(`All proofs are valid.`)
}

run()
