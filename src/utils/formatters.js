export const formatAttributeName = (categoryName, attributeName) => {
    const formattedCategory = categoryName.replace(/\s+/g, '');
    const formattedAttribute = attributeName.replace(/\s+/g, '');
    return `cat-${formattedCategory}-${formattedAttribute}`;
  };