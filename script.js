// Array to store topics
let topics = [];

// Run when the document is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if the 'topic-list' element exists (for topics page)
    const topicList = document.getElementById('topic-list');
    if (topicList) {
        loadTopicsFromStorage(); // Load topics from storage
        renderTopics(); // Render topics if the element exists

        // Add event listener to the category filter
        const categoryFilter = document.getElementById('category-filter');
        categoryFilter.addEventListener('change', renderTopics);
    }

    // Check if the 'news-grid' element exists (for news page)
    const newsGrid = document.getElementById('news-grid');
    if (newsGrid) {
        renderNews(); // Render news if the element exists
    }

    // Check if the 'new-topic-form' element exists (for create topic page)
    const newTopicForm = document.getElementById('new-topic-form');
    if (newTopicForm) {
        setupTopicForm(); // Setup topic creation form if it exists
    }
});

// Function to render topics (for topics page)
function renderTopics() {
    const topicList = document.getElementById('topic-list');
    const categoryFilter = document.getElementById('category-filter').value; // Get selected category
    topicList.innerHTML = ''; // Clear current topics

    // Filter topics based on the selected category
    const filteredTopics = topics.filter(topic => {
        return categoryFilter === 'Semua Kategori' || topic.category === categoryFilter;
    });

    filteredTopics.forEach((topic, index) => {
        const topicDiv = document.createElement('div');
        topicDiv.classList.add('topic');

        const title = document.createElement('h3');
        title.textContent = topic.title;

        const meta = document.createElement('p');
        meta.textContent = `Dibuat oleh: ${topic.author} | ${topic.time}`;

        const category = document.createElement('p');
        category.textContent = `Kategori: ${topic.category}`; // Display the category

        const content = document.createElement('p');
        content.textContent = topic.content;

        // Create a div for comments section
        const commentsDiv = document.createElement('div');
        commentsDiv.classList.add('comments');
        topic.comments.forEach((comment, commentIndex) => {
            const commentPara = document.createElement('p');
            commentPara.innerHTML = `<strong>${comment.author}:</strong> ${comment.text} <em>(${comment.time})</em>`;
            
            // Add a remove button next to the comment
            const removeCommentButton = document.createElement('button');
            removeCommentButton.textContent = 'Remove Comment';
            removeCommentButton.addEventListener('click', () => {
                removeComment(index, commentIndex); // Call removeComment when clicked
            });
            
            commentPara.appendChild(removeCommentButton);
            commentsDiv.appendChild(commentPara);
        });

        // Create a comment form
        const commentForm = document.createElement('form');
        commentForm.classList.add('comment-form');
        const commentNameInput = document.createElement('input');
        commentNameInput.type = 'text';
        commentNameInput.placeholder = 'Nama Anda';
        commentNameInput.required = true;

        const commentInput = document.createElement('input');
        commentInput.type = 'text';
        commentInput.placeholder = 'Masukkan komentar Anda';
        commentInput.required = true;

        const submitCommentButton = document.createElement('button');
        submitCommentButton.textContent = 'Kirim';
        submitCommentButton.addEventListener('click', (event) => {
            event.preventDefault();
            addComment(index, commentNameInput.value, commentInput.value);
            commentInput.value = ''; // Clear the input
            commentNameInput.value = ''; // Clear the name input
        });

        commentForm.appendChild(commentNameInput);
        commentForm.appendChild(commentInput);
        commentForm.appendChild(submitCommentButton);
        
        // Create remove button for the topic
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-button');
        removeButton.textContent = 'X';
        removeButton.addEventListener('click', () => {
            removeTopic(index); // Remove the topic when clicked
        });

        // Append elements to the topic div
        topicDiv.appendChild(removeButton);
        topicDiv.appendChild(title);
        topicDiv.appendChild(meta);
        topicDiv.appendChild(category); // Append the category element
        topicDiv.appendChild(content);
        topicDiv.appendChild(commentsDiv);
        topicDiv.appendChild(commentForm);
        topicList.appendChild(topicDiv);
    });
}


// Function to render news (for news page)
function renderNews() {
    const newsGrid = document.getElementById('news-grid');
    newsGrid.innerHTML = ''; // Clear current news

    const news = [
        {
            title: "Sejumlah Mahasiswa Gelar Aksi Demo Di Patung Kuda: Kami Akan Jadi Oposisi Abadi",
            description: "Sejumlah mahasiswa menggelar aksi demonstrasi di kawasan Patung Kuda, Jakarta Pusat, Jumat (18/10/2024). Jalan Medan Merdeka Barat, yang biasanya diblokade total jika ada aksi massa, kini hanya ditutup setengahnya. Sehingga kendaraan yang mengarah ke Istana Merdeka masih bisa melintas. Sehingga, hanya rakyat dan mahasiswa yang akan menjadi oposisi abadi melawan segala kebijakan pemerintah. Mereka juga menyebut, jika tanggal 20 Oktober nanti, bukanlah hari pelantikan presiden Prabowo. Melainkan peringatan gagalnya pemerintahan Jokowi. “Tanggal 20 bukanlah hari pelantikan presiden tapi peringatan gagalnya pemerintahan Jokowi,” pungkasnya.",
            image: "demo.png"
        },
        {
            title: "Enam Mahasiswa Ditetapkan Sebagai Tersangka, BEM Unram : Polda Dan DPRD Bersekongkol",
            description: "Enam mahasiswa ditetapkan sebagai tersangka oleh Polda NTB setelah aksi unjuk rasa pada 23 Agustus 2024 yang berujung pada pengrusakan gerbang DPRD NTB. Aksi tersebut dilakukan oleh ribuan mahasiswa dari berbagai universitas di NTB, termasuk Universitas Mataram (Unram), untuk memprotes putusan Mahkamah Konstitusi terkait ambang batas pencalonan kepala daerah. Keenam mahasiswa ini dijadwalkan untuk diperiksa lebih lanjut pada 18 Oktober 2024, dan polisi masih mempertimbangkan apakah jumlah tersangka akan bertambah.",
            image: "massa.png"
        },
        {
            title: "Rentetan Bunuh Diri Mahasiswa, Kapan Krisis Mental Generasi Muda Berakhir?",
            description: "Setidaknya tiga mahasiswa di sejumlah daerah di Indonesia mengakhiri hidup dalam satu pekan terakhir. Terbaru, seorang mahasiswa di Jakarta ditemukan tak bernyawa di pelataran gedung kampus, Jumat (04/10). Sebelumnya, di Surabaya, Jawa Timur, seorang mahasiswa ditemukan meninggal karena dugaan bunuh diri, Selasa (01/10). Kemudian, dua hari berselang seorang mahasiswa di Semarang, Jawa Tengah ditemukan tak bernyawa disinyalir bunuh diri di indekos, Kamis (03/10). Tidak ada faktor tunggal yang melatarbelakangi ketiga insiden bunuh diri ini. Akan tetapi sejumlah kalangan mengurai persoalan anak-anak muda yang rentan bunuh diri, termasuk sistem pendukung yang perlu diperbaiki.",
            image: "bundir.jpeg"
        },
        {
            title: "Angkat Potensi Desa, BEM Polimedia 2024 Gelar Pengabdian Masyarakat di Desa Cibadak",
            description: "Kegiatan pengabdian masyarakat yang dilakukan oleh Badan Eksekutif Mahasiswa (BEM) Polimedia 2024 di Desa Cibadak. Kegiatan ini bertujuan untuk mengangkat potensi desa dan memberikan kontribusi positif bagi masyarakat setempat. BEM Polimedia melibatkan mahasiswa dalam berbagai program, seperti pelatihan keterampilan, edukasi tentang pentingnya pengelolaan sumber daya, serta peningkatan kesadaran akan potensi lokal. Diharapkan kegiatan ini dapat memberdayakan masyarakat Desa Cibadak dan meningkatkan kualitas hidup mereka.",
            image: "potensi.png"
        },
        {
            title: "Selain Kacamata, Perbedaan Struktur Gigi Jokowi saat Masih Mahasiswa UGM Juga Jadi Sorotan Publik",
            description: "Perbedaan penampilan Presiden Joko Widodo (Jokowi) saat masih mahasiswa di Universitas Gadjah Mada (UGM) dengan penampilannya sekarang. Selain kacamata yang dikenakan, perhatian juga tertuju pada perbedaan struktur gigi Jokowi. Foto-foto masa lalu Jokowi ketika kuliah menarik perhatian publik dan menimbulkan berbagai komentar di media sosial. Artikel ini menunjukkan bagaimana penampilan seseorang bisa berubah seiring waktu dan menyoroti perjalanan hidup Jokowi dari mahasiswa hingga menjadi pemimpin negara.",
            image: "jokowi.png"
        }
    ];

    news.forEach((newsItem) => {
        const newsCard = document.createElement('div');
        newsCard.classList.add('news-card');

        const newsImage = document.createElement('img');
        newsImage.src = newsItem.image;
        newsImage.style.width = '100%';
        newsImage.style.height = '400px';
        newsImage.style.objectFit = 'cover';

        const newsContent = document.createElement('div');
        newsContent.classList.add('news-card-content');

        const newsTitle = document.createElement('h3');
        newsTitle.textContent = newsItem.title;

        const newsDescription = document.createElement('p');
        newsDescription.textContent = newsItem.description;

        newsContent.appendChild(newsTitle);
        newsContent.appendChild(newsDescription);

        newsCard.appendChild(newsImage);
        newsCard.appendChild(newsContent);

        newsGrid.appendChild(newsCard);
    });
}

// Function to add a comment to a topic
function addComment(topicIndex, author, text) {
    if (!author || !text) {
        showNotification('Nama dan komentar harus diisi!');
        return;
    }

    const comment = {
        author: author,
        text: text,
        time: new Date().toLocaleString(),
    };

    // Add the comment to the selected topic's comments array
    topics[topicIndex].comments.push(comment);

    // Save the updated topics array to local storage
    saveTopicsToStorage();

    // Re-render the topics to reflect the new comment
    renderTopics();

    // Show a notification
    showNotification('Komentar berhasil ditambahkan!');
}

// Function to set up the topic creation form (for create topic page)
// Function to set up the topic creation form (for create topic page)
function setupTopicForm() {
    const newTopicForm = document.getElementById('new-topic-form');
    
    // Form submission event
    newTopicForm.addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent page refresh

        // Get the input values
        const name = document.getElementById('user-name').value;
        const title = document.getElementById('topic-title').value;
        const content = document.getElementById('topic-content').value;
        const category = document.getElementById('topic-category').value;

        // Create the new topic object
        const newTopic = {
            title: title,
            author: name,
            content: content,
            time: new Date().toLocaleString(),
            category: category,  // Add category to the topic
            comments: [],        // Initialize an empty comments array
        };

        // Add the new topic to the topics array
        topics.push(newTopic);
        
        // Save to local storage
        saveTopicsToStorage(); 
        
        // Clear the form fields
        newTopicForm.reset();  // Reset the form inputs

        showNotification('Topik berhasil dibuat!');
    });
}

// Function to remove a topic
function removeTopic(index) {
    topics.splice(index, 1); // Remove the topic from the array
    saveTopicsToStorage(); // Update local storage
    renderTopics(); // Re-render the topics
    showNotification('Topik berhasil dihapus!'); // Notify user
}

// Function to remove a comment
function removeComment(topicIndex, commentIndex) {
    // Remove the comment from the topic's comments array
    topics[topicIndex].comments.splice(commentIndex, 1);

    // Save the updated topics array to local storage
    saveTopicsToStorage();

    // Re-render the topics to reflect the change
    renderTopics();

    // Show a notification
    showNotification('Komentar berhasil dihapus!');
}

// Function to display notifications
function showNotification(message) {
    console.log('Notification triggered:', message);
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000); // Remove notification after 3 seconds
}

// Function to save topics to local storage
function saveTopicsToStorage() {
    localStorage.setItem('topics', JSON.stringify(topics));
}

// Function to load topics from local storage
function loadTopicsFromStorage() {
    const storedTopics = localStorage.getItem('topics');
    if (storedTopics) {
        topics = JSON.parse(storedTopics);
    }
}

// Load topics from storage on page load
loadTopicsFromStorage();

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', function() {
    // Remove user data from localStorage
    localStorage.removeItem('loggedInUser');
    // Redirect to login page after logout
    window.location.href = 'cobalogin.html';
});

const loggedInUser = localStorage.getItem('loggedInUser');
if (loggedInUser) {
    document.getElementById('user-name').value = loggedInUser;
    document.getElementById('user-name').disabled = true; // Nonaktifkan kolom nama agar tidak bisa diubah
} else {
    // Jika tidak ada pengguna yang login, redirect ke halaman login
    window.location.href = 'cobalogin.html';
}
