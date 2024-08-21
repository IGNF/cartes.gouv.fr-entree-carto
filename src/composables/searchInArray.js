
/**
 * 
 * @param { Array } arrayOfObject 
 * @param { String } searchString 
 * @param { Array } properties 
 * @returns Array des obj contenant la searchString dans une des properties
 */
export function getSearchResults(arrayOfObject, searchString, properties) {
    return arrayOfObject.filter((obj) => {
        if (properties.map(prop => {
        if(obj.hasOwnProperty(prop)
                && obj[prop].toLowerCase().includes(searchString.toLowerCase()))
           return true
        }).includes(true))
         return obj
    })
  };
  