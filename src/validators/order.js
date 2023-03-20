export function validateOrder(input) {
    const validationErrors = {}

    if (!('receiver' in input) || input['receiver'].length == 0) {
      validationErrors['name'] = 'cannot be blank'
    }
  
    if (!('contact_number' in input) || input['contact_number'].length == 0) {
      validationErrors['phone'] = 'cannot be blank'
    }

    if (!('address' in input) || input['address'].length == 0) {
      validationErrors['address'] = 'cannot be blank'
    }
  
    return validationErrors
  }