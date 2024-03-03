const latestPostContainer = document.getElementById("latest-post-container");
const latestPostLoader = document.getElementById("latest-post-loader");
const allPostContainer = document.getElementById("all-post-container");
const allPostLoader = document.getElementById("all-post-loader");
const markAsRead = document.getElementById("mark-as-read");
let marAsReadValue = parseInt(markAsRead.innerText);
const markAsReadContainer = document.getElementById("mark-as-read-container");

// latest Posts API handler
const fetchDataLatestPost = async () => {
  try {
    //clear container
    latestPostContainer.innerHTML = "";

    //Show loader for at least 2 second
    latestPostLoader.classList.remove("hidden");

    // fetch data from api
    const url = `https://openapi.programming-hero.com/api/retro-forum/latest-posts`;
    const res = await fetch(url);
    const data = await res.json();

    // call the appendLatestPosts handler
    appendLatestPosts(data);
  } catch (error) {
    console.log("Error from fetching latest post api:", error);
  } finally {
    // Hide loader after at least 2 seconds
    setTimeout(() => {
      latestPostLoader.classList.add("hidden");
    }, 2000);
  }
};
// appendChild function for latest post container
const appendLatestPosts = (data) => {
  data.forEach((item) => {
    const article = createArticleElemetLatest(item);
    latestPostContainer.appendChild(article);
  });
};

//Create article tag handler for latest post container
const createArticleElemetLatest = (item) => {
  //define article tag
  const article = document.createElement("article");
  // add classname inside article tag
  article.className = `bg-white hover:bg-[#F3F3F5] p-5 md:p-7 rounded-lg sm:rounded-xl md:rounded-2xl shadow-md border border-slate-300`;
  //use template litarel for article content
  article.innerHTML = `
  <div class="w-full mb-5">
    <img class="rounded-xl" src="${item?.cover_image}" alt="${item?.title}" />
  </div>
  <div class="text-[#12132D] font-mulish grow">
    <p class="text-base font-semibold opacity-60 mb-3">
      <i class="fa-regular fa-calendar-plus mr-2"></i>
      <span>${item?.author?.posted_date || "No Publish Date"}</span>
    </p>
    <h3 class="text-lg font-bold mb-4 font-mulish">
      ${item?.title}
    </h3>
    <p class="opacity-60 text-base mb-5">
      ${item?.description}
    </p>

    <!-- Author information section  -->
    <div class="flex items-center justify-start gap-3">
      <div class="w-14 h-14 shrink-0">
        <img class="rounded-full" src="${item?.profile_image}" alt="${
    item?.author?.name
  }" />
      </div>
      <div>
        <h5 class="font-bold">${item?.author?.name}</h5>
        <p class="opacity-60 text-sm">${
          item?.author?.designation ? item.author.designation : "Unknown"
        }</p>
      </div>
    </div>
  </div>
    `;
  return article;
};

// let's descuss left container API handler
const fetchDataAllPost = async () => {
  try {
    //clear container
    allPostContainer.innerHTML = "";

    //Show loader for at least 2 second
    allPostLoader.classList.remove("hidden");

    // fetch data from api
    const url = `https://openapi.programming-hero.com/api/retro-forum/posts`;
    const res = await fetch(url);
    const data = await res.json();
    const postsData = data.posts;

    // call the appendAllPosts handler
    appendAllPosts(postsData);
  } catch (error) {
    console.log("Error from fetching all post api:", error);
  } finally {
    // Hide loader after at least 2 seconds
    setTimeout(() => {
      allPostLoader.classList.add("hidden");
    }, 2000);
  }
};

// appendChild function for all post container
const appendAllPosts = (data) => {
  data.forEach((item) => {
    const article = createArticleElemetAll(item);
    allPostContainer.appendChild(article);
  });
};

// Create article tag handler for all post constainer
const createArticleElemetAll = (item) => {
  // check user isAcitve or not
  isUserActive = item?.isActive || false;

  //check data and prepare to sting value for read complete list
  const title = item?.title || "No title";
  const postViewCount = item?.view_count || "No view";

  // check if any string contain single quote
  let string = item.title;
  let updateString = string.replace(/'/g, ",,,");

  //define article tag
  const article = document.createElement("article");
  // add classname inside article tag
  article.className = `bg-[#F3F3F5] hover:bg-[#797DFC1A] p-5 md:p-7 rounded-lg sm:rounded-xl md:rounded-2xl shadow-md flex flex-col sm:flex-row gap-3 md:gap-5`;
  //use template litarel for article content
  article.innerHTML = `
    <div class="indicator shrink-0">
      <span class="indicator-item badge ${
        isUserActive ? "bg-green-700" : "bg-red-700"
      } p-1.5 h-3"></span>
      <div
        class="grid w-20 h-20 bg-white place-items-center rounded-xl">
        <img src="${item?.image}" alt="${item?.author?.name}" />
      </div>
    </div>
    <div class="text-[#12132D] font-inter grow">
      <p class="text-sm font-semibold opacity-80 mb-3">
        <span class="mr-4"># ${item?.category}</span
        ><span>Author: ${item?.author?.name}</span>
      </p>
      <h3 class="text-xl mb-4 font-mulish">
        ${item?.title}
      </h3>
      <p class="opacity-60 text-base mb-5">
        ${item?.description}
      </p>
      <div
        class="border-t-2 border-t-slate-400 border-dotted mb-5"></div>
      <!-- social activities -->
      <div class="flex items-center justify-between">
        <div class="text-sm sm:text-base md:text-lg opacity-60">
          <i class="fa-regular fa-message sm:mr-2"></i>
          <span class="mr-2 sm:mr-4">${item?.comment_count}</span>
          <i class="fa-regular fa-eye sm:mr-2"></i>
          <span class="mr-2 sm:mr-4">${item?.view_count}</span>
          <i class="fa-regular fa-clock sm:mr-2"></i>
          <span class="mr-2 sm:mr-4">${item?.posted_time} min</span>
        </div>
        <div onclick="addToReadedList('${updateString}', '${item?.view_count}')"
          class="text-sm sm:text-base md:text-lg text-white px-2 py-0.5 bg-green-600 rounded-full">
          <i class="fa-solid fa-envelope-open"></i>
        </div>
      </div>
    </div>
    `;
  return article;
};

const addToReadedList = (title, postViewCount) => {
  // Covert to the single quote for the get correct value
  let string = title;
  let updateString = string.replace(/,,,/g, "'");

  // call mark as read container function handler
  appendMarkItem(updateString, postViewCount);

  // call mark as read counter handler
  markAsReadCounter();
};

//appendChild function for mark as read container
const appendMarkItem = (string, postViewCount) => {
  const div = createDivElementReaded(string, postViewCount);
  markAsReadContainer.appendChild(div);
};

// create div tag handler for mark as read container
const createDivElementReaded = (string, postViewCount) => {
  //define div tag
  const div = document.createElement("div");
  // add classname inside div tag
  div.className = `flex justify-between items-center gap-2 bg-white p-4 rounded-xl`;
  //use template litarel for div content
  div.innerHTML = `
  <h4 class="text-base font-semibold grow">
    ${string}
  </h4>
  <p class="font-inter opacity-70 text-sm w-[60px] shrink-0">
    <i class="fa-regular fa-eye mr-1.5"></i>
    ${postViewCount}
  </p>
  `;
  return div;
};

// mark as read counter handler
const markAsReadCounter = () => {
  marAsReadValue++;
  markAsRead.innerText = marAsReadValue;
};

// banner section serach button function handler by postByQuery api

const fetchDataByQuery = () => {
  console.log("Hello");
};

fetchDataAllPost();

fetchDataLatestPost();
