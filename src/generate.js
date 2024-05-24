import { StandardMerkleTree } from '@openzeppelin/merkle-tree'
import { promises as fs } from 'fs'
import { parse } from 'csv-parse/sync'

const debugLog = console.debug

async function writeTreeAndRoot(outDir, tree) {
  await fs.mkdir(`${outDir}`, { recursive: true })

  // Write the Merkle root for posterity
  debugLog('Merkle Root:', tree.root)
  await fs.writeFile(`${outDir}/root`, tree.root)

  await fs.writeFile(
    `${outDir}/tree.json`,
    JSON.stringify(tree.dump(), null, 2),
  )
}

async function writeTotal(outDir, leafValues) {
  let sum = 0n
  for (const leaf of leafValues) {
    sum += BigInt(leaf[1])
  }

  await fs.writeFile(
      `${outDir}/total`,
      sum.toString()
  )
}

async function writeProofs(outDir, tree) {
  await fs.mkdir(`${outDir}/proofs`, { recursive: true })

  for (const [i, v] of tree.entries()) {
    const proof = tree.getProof(i)
    const [address, amount] = v

    debugLog('Value:', v)
    debugLog('Proof:', proof)

    const out = {
      amount,
      proof,
    }

    fs.writeFile(`${outDir}/proofs/${address}.json`, JSON.stringify(out))

    debugLog(`${address} file saved.`)
  }
}

async function run() {
  try {
    const environmentsPaths = await fs.readdir(`values`);
    // Should be "<env>.csv"
    const environments = environmentsPaths.map(x => x.split(".")[0])
    for(const environment of environments ) {
      const leafValues = parse(await fs.readFile(`values/${environment}.csv`))

      debugLog('Leaf Values:', leafValues)

      const tree = StandardMerkleTree.of(leafValues, ['address', 'uint256'])

      const baseOutDir = 'dist'
      const outDir = `${baseOutDir}/${environment}`

      await writeTreeAndRoot(outDir, tree)
      await writeTotal(outDir, leafValues)
      await writeProofs(outDir, tree)
    }

  } catch (error) {
    console.error(error)
  }
}

run()
