const sample = { 
  "context": "https://en.wikipedia.org/wiki/Kung_Fury_(film)", 
  "thumbnail": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmZNyEhrNTnZeSECKyAF1fxjGpDCmxuJjnIbnJFF3uD9LXCGL8nhpREMI", 
  "url": "https://upload.wikimedia.org/wikipedia/en/thumb/0/0d/Kung_Fury_Poster.png/220px-Kung_Fury_Poster.png", 
  "snippet": "Kung Fury (film) - Wikipedia" 
};
const target = document.querySelector('#json-preview');
setTimeout(() => {target.textContent = JSON.stringify(sample, null, 2)}, 0)