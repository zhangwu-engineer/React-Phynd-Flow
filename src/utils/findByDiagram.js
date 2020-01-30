export const findByDiagram = (cyListener, parent) => {
  const elements = cyListener && cyListener._private && cyListener._private.elements;
  let foundIndex = 0;
  elements.some(function (element) {
    foundIndex++;
    return element._private.data.id === parent.data.id;
  });

  while (foundIndex < elements.length) {
    if (elements[foundIndex]._private.data.parentType === parent.data.nextType) {
      return elements[foundIndex]._private;
    }
    foundIndex++;
  }
  return null;
}