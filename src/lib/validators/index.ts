// src/lib/validators/index.ts
export function validateBookingForm(data: {
    fullName: string;
    district: string;
    sector: string;
    village: string;
    idNumber: string;
    bookingDate: string;
  }) {
    const errors: Record<string, string> = {};
    
    // Required field validation
    Object.entries(data).forEach(([key, value]) => {
      if (!value?.trim()) {
        errors[key] = 'This field is required';
      }
    });
    
    // ID number validation (assuming 16 digits for Rwanda)
    if (data.idNumber && !/^\d{16}$/.test(data.idNumber)) {
      errors.idNumber = 'ID number must be 16 digits';
    }
    
    // Date validation
    if (data.bookingDate) {
      const selectedDate = new Date(data.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.bookingDate = 'Booking date cannot be in the past';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
  
  export function validateEquipmentForm(data: {
    name: string;
    description: string;
    shortDescription: string;
    price: string;
    category: string;
  }) {
    const errors: Record<string, string> = {};
    
    // Required field validation
    Object.entries(data).forEach(([key, value]) => {
      if (!value?.trim()) {
        errors[key] = 'This field is required';
      }
    });
    
    // Price validation
    if (data.price && isNaN(Number(data.price))) {
      errors.price = 'Price must be a number';
    }
    
    // Short description length validation
    if (data.shortDescription && data.shortDescription.length > 100) {
      errors.shortDescription = 'Short description must be 100 characters or less';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }