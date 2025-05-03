import { vi, describe, expect, test } from 'vitest';
import { toShare, fromShare } from '@/features/share';
import { useServiceStore } from '@/stores/serviceStore';
import { setActivePinia, createPinia } from 'pinia';

// INFO
// https://vitest.dev/api/
// https://vitest.dev/api/expect.html

beforeAll(() => {
  // pinia
  setActivePinia(createPinia())
  var store = useServiceStore()
  store.setService({
    mode : "remote"
  })
})

describe('toShare', () => {
  beforeEach(() => {
  })

  it('document empty', () => {
    var url = toShare({})
    expect(url).toBeUndefined()
  })

  it('document de type : vecteur', () => {
    const expected = "MbJm2TiNss64KS0kcTyh8F3NBslCr3L3lB1TlBxulLs3E6.bin?i=ac16ac4a-1acd-465c-9003-b33c64ccc705&n=Mes+regions&f=geojson&t=import&c=internal"
    var url = toShare({
      "name": "Mes regions",
      "description": "carte des regions",
      "size": 529739,
      "mime_type": "application/octet-stream",
      "labels": [
        "cartes.gouv.fr",
        "import",
        "geojson",
        "internal"
      ],
      "public_url": "https://data.geopf.fr/documents/MbJm2TiNss64KS0kcTyh8F3NBslCr3L3lB1TlBxulLs3E6.bin",
      "_id": "ac16ac4a-1acd-465c-9003-b33c64ccc705"
    })
    expect(url).toBeDefined()
    expect(url).toEqual(expected)
    console.log(url)
  })

  it.skip('document de type : service')
  it.skip('document de type : mapbox')
  it.skip('document de type : compute')

  it('document avec des params supplementaires', () => {
    const expected = "MbJm2TiNss64KS0kcTyh8F3NBslCr3L3lB1TlBxulLs3E6.bin?i=ac16ac4a-1acd-465c-9003-b33c64ccc705&n=Mes+regions&f=geojson&t=import&c=internal&o=0.5&v=true&g=true"
    var url = toShare({
      "name": "Mes regions",
      "description": "carte des regions",
      "size": 529739,
      "mime_type": "application/octet-stream",
      "labels": [
        "cartes.gouv.fr",
        "import",
        "geojson",
        "internal"
      ],
      "public_url": "https://data.geopf.fr/documents/MbJm2TiNss64KS0kcTyh8F3NBslCr3L3lB1TlBxulLs3E6.bin",
      "_id": "ac16ac4a-1acd-465c-9003-b33c64ccc705"
    }, {
      opacity:0.5,
      visible: true,
      grayscale: true
    })
    expect(url).toBeDefined()
    expect(url).toEqual(expected)
    console.log(url)
  })

})

describe('fromShare', () => {
  beforeEach(() => {
  })

  it('url empty', () => {
    var document = fromShare()
    expect(document).toBeUndefined()
  })

  it('url de partage de type : vecteur', () => {
    const expected = {
      name: "Mes regions",
      id: "ac16ac4a-1acd-465c-9003-b33c64ccc705",
      format: "geojson",
      type: "import",
      target: "internal",
      url: 'https://data.geopf.fr/documents/MbJm2TiNss64KS0kcTyh8F3NBslCr3L3lB1TlBxulLs3E6.bin'
    }
    var url = 'MbJm2TiNss64KS0kcTyh8F3NBslCr3L3lB1TlBxulLs3E6.bin?' +
    'n=Mes+regions&' +
    'i=ac16ac4a-1acd-465c-9003-b33c64ccc705&' +
    'f=geojson&' +
    't=import&' +
    'c=internal'

    var document = fromShare(url)
    expect(document).toBeDefined()
    expect(document).toEqual(expected)
    console.log(document)
  })

  it.todo('url de partage de type : mapbox')
  it.todo('url de partage de type : service')
  it.todo('url de partage de type : compute')

  it('url avec des params supplementaires', () => {
    const expected = {
      name: "Mes regions",
      id: "ac16ac4a-1acd-465c-9003-b33c64ccc705",
      format: "geojson",
      grayscale: "true",
      opacity: "0.5",
      visible: "true",
      type: "import",
      target: "internal",
      url: 'https://data.geopf.fr/documents/MbJm2TiNss64KS0kcTyh8F3NBslCr3L3lB1TlBxulLs3E6.bin'
    }
    var url = 'MbJm2TiNss64KS0kcTyh8F3NBslCr3L3lB1TlBxulLs3E6.bin?' +
    'n=Mes+regions&' +
    'i=ac16ac4a-1acd-465c-9003-b33c64ccc705&' +
    'f=geojson&' +
    't=import&' +
    'c=internal&' + 
    'o=0.5&' + 
    'v=true&' + 
    'g=true'
    var document = fromShare(url)
    expect(document).toBeDefined()
    expect(document).toEqual(expected)
    console.log(document)
  })
})

