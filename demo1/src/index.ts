const num = 45

interface Cat {
  name: String,
  gender: String
}

function touchCat (cat: Cat): void {
  console.log(cat.name)
}

touchCat({
  name: 'tom',
  gender: 'male'
})
