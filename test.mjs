import * as bcrypt from 'bcrypt'

async function run() {
  const hash = await bcrypt.hash('12345678', 10)
  console.log(hash)
}

run()
