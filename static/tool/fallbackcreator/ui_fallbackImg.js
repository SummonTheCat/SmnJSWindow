/**
 * Initializes listeners for the Intro and Outro image file inputs.
 * Handles image selection and uploading to the server using multipart/form-data.
 */
function initializeImageUpload() {
    // Select the file input elements by their IDs
    const introInput = document.getElementById('fallback-image-intro');
    const outroInput = document.getElementById('fallback-image-outro');

    // Function to handle file selection and upload
    const handleFileUpload = async (event, imgType) => {
        const file = event.target.files[0]; // Get the selected file

        if (!file) {
            // No file selected
            return;
        }

        // Validate the file type (must be PNG)
        if (file.type !== 'image/png') {
            alert('Please select a PNG image.');
            event.target.value = ''; // Reset the input
            return;
        }

        // Optional: Validate file size (e.g., max 5MB)
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_FILE_SIZE) {
            alert('File size exceeds the 5MB limit.');
            event.target.value = ''; // Reset the input
            return;
        }

        try {
            // Prepare the FormData object
            const formData = new FormData();
            formData.append('image', file); // 'image' should match multer's single field name

            // Determine the correct route based on imgType
            const route = `/tool/fallbackcreator/setimg/${imgType}`;

            // Send the image to the server
            const response = await fetch(route, {
                method: 'POST',
                body: formData
                // Note: Do not set the 'Content-Type' header when sending FormData.
            });

            if (response.ok) {
                const responseText = await response.text();
                alert(`Successfully uploaded ${imgType} image.`);
                // Optionally, update the UI to reflect the successful upload
                displayUploadedImage(imgType, URL.createObjectURL(file));
            } else {
                const errorText = await response.text();
                alert(`Failed to upload ${imgType} image: ${errorText}`);
            }
        } catch (error) {
            console.error(`Error uploading ${imgType} image:`, error);
            alert(`An error occurred while uploading the ${imgType} image.`);
        }
    };

    // Optional: Function to display the uploaded image
    const displayUploadedImage = (imgType, imageUrl) => {
        const imgElement = document.getElementById(`fallback-image`);
        if (imgElement) {
            imgElement.src = imageUrl;
            imgElement.style.display = 'block'; // Make the image visible
        }
    };

    // Attach change event listeners to both inputs
    if (introInput) {
        introInput.addEventListener('change', (event) => {
            handleFileUpload(event, 'intro');
        });
    }

    if (outroInput) {
        outroInput.addEventListener('change', (event) => {
            handleFileUpload(event, 'outro');
        });
    }
}

/*
* Updates the image source based on the current phase.
*/
function updateImageSource() {
   const imgElement = document.getElementById('fallback-image');
   if (!imgElement) {
       console.warn('Fallback image element not found.');
       return;
   }
   let randomQuery = Math.random().toString(36).substring(7);
   const isPostAccept = fallbackDiv.classList.contains('post-accept');
   if (isPostAccept) {
       imgElement.src = 'fallback/outro.png?' + randomQuery;
       imgElement.alt = 'Outro Image';
       console.log('Switched to Post-Accept Phase Image: dev/outro.png');
   } else {
    
       imgElement.src = 'fallback/intro.png?' + randomQuery;
       imgElement.alt = 'Intro Image';
       console.log('Switched to Pre-Accept Phase Image: dev/intro.png');
   }
}
