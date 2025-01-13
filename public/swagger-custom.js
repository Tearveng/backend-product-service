/* eslint-disable prettier/prettier */
window.onload = function() {
  // Create a select dropdown for navigation
  const select = document.createElement('select');
  select.id = 'swagger-nav-select';
  select.style.position = 'absolute';
  select.style.top = '10px';
  select.style.left = '10px';
  select.style.zIndex = '999';
  select.style.padding = '5px';

  // Create options for the select dropdown
  const catsOption = document.createElement('option');
  catsOption.value = 'products';
  catsOption.text = 'Products';
  select.appendChild(catsOption);

  const dogsOption = document.createElement('option');
  dogsOption.value = 'app';
  dogsOption.text = 'App';
  select.appendChild(dogsOption);

  // Add the select dropdown to the Swagger UI
  document.body.appendChild(select);

  // Add event listener for select dropdown
  select.addEventListener('change', function(event) {
    const selectedTag = event.target.value;
    const tagId = `tag-${selectedTag}`;

    // Toggle visibility of API groups based on selected tag
    const allTags = document.querySelectorAll('.swagger-ui .opblock-tag');
    allTags.forEach(tag => {
      if (tag.id === tagId) {
        tag.style.display = 'block';  // Show selected group
      } else {
        tag.style.display = 'none';  // Hide other groups
      }
    });
  });

  // Initially, show only the "cats" section
  const allTags = document.querySelectorAll('.swagger-ui .opblock-tag');
  allTags.forEach(tag => {
    if (tag.id !== 'tag-products') {
      tag.style.display = 'none';  // Hide other groups
    }
  });
};