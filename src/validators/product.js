export function validateProduct(input) {
    const validationErrors = {}

    if (!('url' in input) || input['url'].length == 0) {
      validationErrors['image'] = 'must be at least 1 image'
    }
  
    if (!('title' in input) || input['title'].length == 0) {
      validationErrors['productname'] = 'cannot be blank'
    }

    if (!('category' in input) || input['category'].length == 0) {
      validationErrors['category'] = 'cannot be blank'
    }

    if (!('condition' in input) || input['condition'].length == 0) {
      validationErrors['condition'] = 'cannot be blank'
    }
  
    if (!('price' in input) || input['price'].length == 0) {
      validationErrors['price'] = 'cannot be blank'
    }
  
    if (!('stock' in input) || input['stock'].length == 0) {
      validationErrors['stock'] = 'cannot be blank'
    }

    if ('description' in input && input['description'].length < 8) {
      validationErrors['description'] = 'should be at least 8 characters'
    }
  
    return validationErrors
  }