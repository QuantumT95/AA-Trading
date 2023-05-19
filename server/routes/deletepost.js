// Assuming you have a "Delete" button with the class "delete-button" for each post
const deleteButtons = document.querySelectorAll('.delete-button');

// Attach click event listeners to the delete buttons
deleteButtons.forEach(deleteButton => {
  deleteButton.addEventListener('click', handleDelete);
});

// Function to handle the delete request
async function handleDelete(event) {
  event.preventDefault();

  const postId = event.target.dataset.postId; // Assuming you have a data attribute for the post ID

  try {
    const response = await fetch(`/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      // Post deleted successfully
      // You can redirect the user to the homepage or perform any other desired action
      window.location.href = '/'; // Redirect to the homepage
    } else {
      // Handle the error response
      const errorData = await response.json();
      console.log(errorData);
      // Display an error message to the user
    }
  } catch (error) {
    console.log(error);
    // Display an error message to the user
  }
}
