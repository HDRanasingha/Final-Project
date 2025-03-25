// Utility functions for wishlist management

// Generate or get a unique device ID
const getDeviceId = () => {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
};

// Get the wishlist key specific to this device
const getWishlistKey = () => {
  const deviceId = getDeviceId();
  return `guestWishlist_${deviceId}`;
};

// Add an item to wishlist
export const addToWishlist = (item) => {
  try {
    if (!item || !item._id) {
      console.error("Invalid item data:", item);
      return false;
    }
    
    // Get existing wishlist or initialize empty array
    const wishlistKey = getWishlistKey();
    console.log("Using wishlist key:", wishlistKey);
    
    let existingWishlist = [];
    try {
      const storedWishlist = localStorage.getItem(wishlistKey);
      existingWishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
    } catch (e) {
      console.error("Error parsing wishlist:", e);
      existingWishlist = [];
    }
    
    console.log("Current wishlist:", existingWishlist);
    
    // Check if item already exists in wishlist
    const itemExists = existingWishlist.find(
      wishlistItem => 
        wishlistItem._id === item._id && 
        wishlistItem.itemType === item.itemType
    );
    
    // Only add if item doesn't already exist
    if (!itemExists) {
      const newWishlist = [...existingWishlist, item];
      localStorage.setItem(wishlistKey, JSON.stringify(newWishlist));
      console.log("Item added to wishlist. New wishlist:", newWishlist);
      return true; // Item was added
    }
    
    console.log("Item already exists in wishlist");
    return false; // Item already exists
  } catch (error) {
    console.error("Error in addToWishlist:", error);
    return false;
  }
};

// Remove an item from wishlist
export const removeFromWishlist = (id, type) => {
  try {
    const wishlistKey = getWishlistKey();
    const existingWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
    console.log("Removing from wishlist. Current wishlist:", existingWishlist);
    
    const newWishlist = existingWishlist.filter(item => 
      !(item._id === id && item.itemType === type)
    );
    
    localStorage.setItem(wishlistKey, JSON.stringify(newWishlist));
    console.log("Item removed. New wishlist:", newWishlist);
    return true;
  } catch (error) {
    console.error("Error in removeFromWishlist:", error);
    return false;
  }
};

// Check if an item is in the wishlist
export const isInWishlist = (id, type) => {
  try {
    const wishlistKey = getWishlistKey();
    const existingWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
    
    const isInList = existingWishlist.some(item => 
      item._id === id && item.itemType === type
    );
    
    console.log(`Checking if item ${id} (${type}) is in wishlist:`, isInList);
    return isInList;
  } catch (error) {
    console.error("Error in isInWishlist:", error);
    return false;
  }
};

// Get the entire wishlist
export const getWishlist = () => {
  try {
    const wishlistKey = getWishlistKey();
    const wishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
    console.log("Getting wishlist:", wishlist);
    return wishlist;
  } catch (error) {
    console.error("Error in getWishlist:", error);
    return [];
  }
};