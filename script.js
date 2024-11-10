// Define constants
const API_URL = 'https://jsonplaceholder.typicode.com';
const POSTS_PER_PAGE = 10;

let posts = [];
let currentPage = 1;

// DOM Elements
const postsContainer = document.getElementById('posts-container');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

// Fetch posts from the API
async function fetchPosts() {
  const response = await fetch(`${API_URL}/posts`);
  posts = await response.json();
  displayPosts();
}

// Display posts on the page
function displayPosts() {
  postsContainer.innerHTML = '';

  const filteredPosts = filterAndSortPosts();
  const paginatedPosts = paginatePosts(filteredPosts);

  paginatedPosts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = (`<h3>${post.title}</h3><p>${post.body}</p>`);
    postElement.onclick = () => openComments(post.id);
    postsContainer.appendChild(postElement);
  });

  updatePaginationButtons(filteredPosts.length);
}

// Filter, sort, and search posts
function filterAndSortPosts() {
  let filtered = posts.filter(post => post.title.includes(searchInput.value));

  if (sortSelect.value === 'desc') {
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  } else {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  return filtered;
}

// Paginate posts
function paginatePosts(filteredPosts) {
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  return filteredPosts.slice(start, end);
}

// Update pagination button states
function updatePaginationButtons(totalPosts) {
  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage * POSTS_PER_PAGE >= totalPosts;
  pageInfo.textContent = Page(`${currentPage}`);
}

// Open comments in a new tab
async function openComments(postId) {
  const response = await fetch(`${API_URL}/comments?postId=${postId}`);
  const comments = await response.json();

  const commentsWindow = window.open('', '_blank');
  commentsWindow.document.write('<h1>Comments</h1>');

  comments.forEach(comment => {
    commentsWindow.document.write(`
      <div>
        <h3>${comment.name}</h3>
        <p>${comment.body}</p>
        <hr>
      </div>
    `);
  });
}

// Event listeners
searchInput.addEventListener('input', () => {
  currentPage = 1;
  displayPosts();
});

sortSelect.addEventListener('change', () => {
  displayPosts();
});

prevPageButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    displayPosts();
  }
});

nextPageButton.addEventListener('click', () => {
  currentPage++;
  displayPosts();
});

// Initial fetch
fetchPosts();