/* =========================================================
   NewsroomFlow - Simple & Easy JavaScript (CSE326 Project)
   ========================================================= */

// 1. DEFAULT STORIES DATA
var defaultStories = [
  {
    title: "India's Growth Story Continues",
    status: "Published",
    priority: "High",
    assigned: "Amit Singh",
    deadline: "2026-11-05",
    thumb: "assets/thumb-india-growth.jpg",
    body: "India's economic growth continues with strong investments in infrastructure, clean energy, manufacturing, and digital public services across major states."
  },
  {
    title: "Technology Trends 2025",
    status: "Published",
    priority: "Medium",
    assigned: "Neha Verma",
    deadline: "2026-11-08",
    thumb: "assets/thumb-tech-blue.jpg",
    body: "Artificial intelligence, high-speed optical networks, and automated fact-checking tools are transforming modern newsrooms and global industries."
  },
  {
    title: "Sports: A New Champion",
    status: "Draft",
    priority: "Low",
    assigned: "Rohit Sharma",
    deadline: "2026-11-10",
    thumb: "assets/thumb-sports.jpg",
    body: "In a thrilling final match under stadium floodlights, a late stoppage-time goal crowned a brand-new national champion."
  }
];

// Newsroom Journalists List
var journalists = [
  { name: "Amit Singh", beat: "Economy & Business", avatar: "assets/avatar-amit.jpg" },
  { name: "Neha Verma", beat: "Technology & AI", avatar: "assets/avatar-priya.jpg" },
  { name: "Rohit Sharma", beat: "Sports Desk", avatar: "assets/avatar-amit.jpg" },
  { name: "Priya Mehta", beat: "National & Editorial", avatar: "assets/avatar-priya.jpg" }
];

// 2. DEFAULT COMMENTS DATA
var defaultComments = [
  {
    author: "Priya Mehta",
    role: "Editor",
    avatar: "assets/avatar-priya.jpg",
    text: "Please add more data in the second paragraph.",
    time: "Apr 27, 11:45 AM"
  },
  {
    author: "Amit Singh",
    role: "Journalist",
    avatar: "assets/avatar-amit.jpg",
    text: "Looks good, moving to approval.",
    time: "Apr 27, 11:30 AM"
  }
];

// Load saved data from browser localStorage (or use default data)
var stories = JSON.parse(localStorage.getItem("nf_stories_gold")) || JSON.parse(JSON.stringify(defaultStories));
var comments = JSON.parse(localStorage.getItem("nf_comments_gold")) || JSON.parse(JSON.stringify(defaultComments));

var currentFilter = "All";
var currentRole = "Chief Editor";
var workflowOrder = ["Draft", "Pending", "Under Review", "Editing", "Approved", "Published"];


// 3. SAVE DATA & SHOW NOTIFICATION
function saveData() {
  localStorage.setItem("nf_stories_gold", JSON.stringify(stories));
  localStorage.setItem("nf_comments_gold", JSON.stringify(comments));
}

function showToast(message) {
  var toast = document.getElementById("toastMsg");
  toast.innerText = message;
  toast.hidden = false;

  setTimeout(function () {
    toast.hidden = true;
  }, 3000);
}


// 4. SWITCH BETWEEN PAGES (SIDEBAR MENU)
function showPage(pageName) {
  var pages = ["dashboard", "submit", "assign", "stories", "comments", "workflow"];

  for (var i = 0; i < pages.length; i++) {
    var pageDiv = document.getElementById("page-" + pages[i]);
    if (pageDiv) {
      pageDiv.hidden = (pages[i] !== pageName);
    }

    var navBtn = document.getElementById("nav-" + pages[i]);
    if (navBtn) {
      if (pages[i] === pageName) {
        navBtn.classList.add("active");
      } else {
        navBtn.classList.remove("active");
      }
    }
  }

  // Show Hero Banner on Dashboard; switch to compact topbar on inner pages
  var heroBanner = document.getElementById("heroBanner");
  var mainArea = document.getElementById("mainArea");
  if (pageName === "dashboard") {
    heroBanner.hidden = false;
    mainArea.classList.remove("inner-mode");
  } else {
    heroBanner.hidden = true;
    mainArea.classList.add("inner-mode");
  }

  document.getElementById("profileMenu").hidden = true;
  renderAll();
}


// 5. HELPER FUNCTIONS FOR BADGE COLORS
function getStatusBadgeClass(status) {
  if (status === "Approved") return "badge-approved";
  if (status === "Draft") return "badge-draft";
  if (status === "Under Review") return "badge-review";
  if (status === "Editing") return "badge-editing";
  if (status === "Published") return "badge-published";
  return "badge-pending";
}

function getPriorityBadgeClass(priority) {
  if (priority === "High") return "high-badge";
  if (priority === "Low") return "low-badge";
  return "medium-badge";
}


// 6. UPDATE TOP 4 SUMMARY NUMBERS
function updateStats() {
  var assigned = 0;
  var approved = 0;
  var published = 0;

  for (var i = 0; i < stories.length; i++) {
    if (stories[i].status !== "Draft") assigned++;
    if (stories[i].status === "Approved") approved++;
    if (stories[i].status === "Published") published++;
  }

  document.getElementById("totalCount").innerText = 21 + stories.length;
  document.getElementById("assignedCount").innerText = 10 + assigned;
  document.getElementById("approvedCount").innerText = 17 + approved;
  document.getElementById("publishedCount").innerText = 14 + published;
}


// 7. RENDER STORIES TABLES (DASHBOARD & MY STORIES)
function renderStories() {
  var searchText = document.getElementById("searchInput").value.toLowerCase();
  var recentHTML = "";
  var allHTML = "";
  var recentShown = 0;

  for (var i = 0; i < stories.length; i++) {
    var s = stories[i];

    var matchesSearch =
      s.title.toLowerCase().indexOf(searchText) !== -1 ||
      s.assigned.toLowerCase().indexOf(searchText) !== -1 ||
      s.status.toLowerCase().indexOf(searchText) !== -1;

    if (!matchesSearch) continue;

    var rowHTML =
      "<tr>" +
        "<td>" +
          "<div class='title-cell' onclick='viewStory(" + i + ")'>" +
            "<img src='" + s.thumb + "' alt='thumb'>" +
            "<span>" + s.title + "</span>" +
          "</div>" +
        "</td>" +
        "<td><span class='badge " + getStatusBadgeClass(s.status) + "'>" + s.status + "</span></td>" +
        "<td><span class='badge " + getPriorityBadgeClass(s.priority) + "'>" + s.priority + "</span></td>" +
        "<td><span class='assign-link' onclick='openAssignModal(" + i + ")' title='Click to reassign journalist'>" + s.assigned + "</span></td>" +
        "<td class='action-icons'>" +
          "<button onclick='viewStory(" + i + ")' title='View'><i class='view-icon'></i></button>" +
          "<button onclick='editStory(" + i + ")' title='Edit'><i class='edit-icon'></i></button>" +
          "<button class='delete-btn' onclick='deleteStory(" + i + ")' title='Delete'><i class='delete-icon'></i></button>" +
        "</td>" +
      "</tr>";

    if (searchText !== "" || recentShown < 2) {
      recentHTML += rowHTML;
      recentShown++;
    }

    if (currentFilter === "All" || s.status === currentFilter) {
      allHTML += rowHTML;
    }
  }

  if (recentHTML === "") recentHTML = "<tr><td colspan='5'>No stories found.</td></tr>";
  if (allHTML === "") allHTML = "<tr><td colspan='5'>No stories in this stage yet.</td></tr>";

  document.getElementById("recentStoriesBody").innerHTML = recentHTML;
  document.getElementById("allStoriesBody").innerHTML = allHTML;
}


// 8. RENDER COMMENTS FEED
function renderComments() {
  var html = "";

  for (var i = 0; i < comments.length; i++) {
    var c = comments[i];
    var roleClass = (c.role === "Editor") ? "role-editor" : "role-journalist";

    html +=
      "<div class='comment-box'>" +
        "<img src='" + c.avatar + "' alt='User'>" +
        "<div>" +
          "<h4>" + c.author + " <span class='role-tag " + roleClass + "'>" + c.role + "</span></h4>" +
          "<p>" + c.text + "</p>" +
          "<small>" + c.time + "</small>" +
        "</div>" +
      "</div>";
  }

  document.getElementById("dashboardComments").innerHTML = html;
  document.getElementById("allCommentsList").innerHTML = html;
}


// 9. RENDER 5-STAGE WORKFLOW BOARD & LIVE PUBLISHED NEWS
function renderWorkflowBoard() {
  var stages = ["Pending", "Under Review", "Editing", "Approved", "Published"];
  var boardHTML = "";

  for (var s = 0; s < stages.length; s++) {
    var stageName = stages[s];
    boardHTML += "<div class='board-col'><h4>" + stageName + "</h4>";

    for (var i = 0; i < stories.length; i++) {
      if (stories[i].status === stageName) {
        boardHTML +=
          "<div class='board-card'>" +
            "<strong>" + stories[i].title + "</strong>" +
            "<small>Assigned: " + stories[i].assigned + "</small>";

        if (stageName !== "Published") {
          boardHTML += "<button class='next-btn' onclick='advanceStage(" + i + ")'>Next Stage →</button>";
        } else {
          boardHTML += "<span class='badge badge-published'>Live ✓</span>";
        }
        boardHTML += "</div>";
      }
    }
    boardHTML += "</div>";
  }

  document.getElementById("workflowBoard").innerHTML = boardHTML;

  var pubHTML = "";
  for (var j = 0; j < stories.length; j++) {
    if (stories[j].status === "Published" || stories[j].status === "Approved") {
      pubHTML +=
        "<div class='pub-card'>" +
          "<img src='" + stories[j].thumb + "' alt='News'>" +
          "<div class='pub-card-body'>" +
            "<span class='badge " + getStatusBadgeClass(stories[j].status) + "'>" + stories[j].status + "</span>" +
            "<h4>" + stories[j].title + "</h4>" +
            "<p>By " + stories[j].assigned + " • " + stories[j].body.substring(0, 85) + "...</p>" +
          "</div>" +
        "</div>";
    }
  }

  if (pubHTML === "") pubHTML = "<p>No approved or published articles yet.</p>";
  document.getElementById("publishedGrid").innerHTML = pubHTML;
}

function renderAll() {
  updateStats();
  renderStories();
  renderComments();
  renderWorkflowBoard();
  renderAssignmentPage();
}


// 10. JOURNALIST ASSIGNMENT DESK FUNCTIONS
function renderAssignmentPage() {
  var rosterHTML = "";
  for (var j = 0; j < journalists.length; j++) {
    var person = journalists[j];
    var count = 0;
    for (var k = 0; k < stories.length; k++) {
      if (stories[k].assigned === person.name && stories[k].status !== "Published") {
        count++;
      }
    }

    var statusBadge = (count >= 2)
      ? "<span class='badge badge-pending'>Busy (" + count + " Active)</span>"
      : "<span class='badge badge-approved'>Available (" + count + " Active)</span>";

    rosterHTML +=
      "<div class='journalist-card'>" +
        "<img src='" + person.avatar + "' alt='" + person.name + "'>" +
        "<h4>" + person.name + "</h4>" +
        "<p>" + person.beat + "</p>" +
        statusBadge +
        "<button class='next-btn' onclick=\"selectJournalistCard('" + person.name + "')\">Select Journalist</button>" +
      "</div>";
  }
  document.getElementById("journalistRoster").innerHTML = rosterHTML;

  var selectHTML = "";
  for (var i = 0; i < stories.length; i++) {
    selectHTML += "<option value='" + i + "'>" + stories[i].title + " (" + stories[i].status + ")</option>";
  }
  selectHTML += "<option value='new'>+ Create & Assign New Story</option>";
  document.getElementById("assignStory").innerHTML = selectHTML;
  toggleNewAssignmentTitle();

  if (!document.getElementById("assignDate").value) {
    document.getElementById("assignDate").value = "2026-11-07";
  }

  var tableHTML = "";
  for (var m = 0; m < stories.length; m++) {
    var st = stories[m];
    var dl = st.deadline || "2026-11-06";
    tableHTML +=
      "<tr>" +
        "<td><strong>" + st.title + "</strong></td>" +
        "<td>" + st.assigned + "</td>" +
        "<td>" + dl + "</td>" +
        "<td><span class='badge " + getPriorityBadgeClass(st.priority) + "'>" + st.priority + "</span></td>" +
        "<td class='action-icons'>" +
          "<button onclick='openAssignModal(" + m + ")' title='Reassign Journalist'><i class='assign-icon'></i></button>" +
        "</td>" +
      "</tr>";
  }
  document.getElementById("assignmentsTableBody").innerHTML = tableHTML;
}

function selectJournalistCard(name) {
  document.getElementById("assignWriter").value = name;
  document.getElementById("assignNote").focus();
  showToast("Selected journalist: " + name);
}

function toggleNewAssignmentTitle() {
  var val = document.getElementById("assignStory").value;
  var box = document.getElementById("newAssignBox");
  if (box) {
    box.hidden = (val !== "new");
  }
}

function assignStoryFromDesk(event) {
  event.preventDefault();

  if (currentRole === "Journalist") {
    showToast("Access Denied: Only Editor or Chief Editor can assign journalists!");
    return;
  }

  var storyChoice = document.getElementById("assignStory").value;
  var journalist = document.getElementById("assignWriter").value;
  var deadline = document.getElementById("assignDate").value;
  var priority = document.getElementById("assignPriority").value;
  var brief = document.getElementById("assignNote").value;
  var targetTitle = "";

  if (storyChoice === "new") {
    var newHeadline = document.getElementById("assignNewTitle").value.trim();
    if (!newHeadline) {
      showToast("Please enter a headline for the new assignment!");
      return;
    }
    targetTitle = newHeadline;
    stories.unshift({
      title: newHeadline,
      status: "Pending",
      priority: priority,
      assigned: journalist,
      deadline: deadline,
      thumb: "assets/thumb-india-growth.jpg",
      body: "Editorial Assignment Brief: " + brief
    });
    document.getElementById("assignNewTitle").value = "";
  } else {
    var idx = parseInt(storyChoice);
    stories[idx].assigned = journalist;
    stories[idx].deadline = deadline;
    stories[idx].priority = priority;
    if (stories[idx].status === "Draft") stories[idx].status = "Pending";
    targetTitle = stories[idx].title;
  }

  comments.unshift({
    author: currentRole,
    role: "Editor",
    avatar: "assets/avatar-priya.jpg",
    text: "Assigned '" + targetTitle + "' to " + journalist + " (Due: " + deadline + ") — " + brief,
    time: "Just now"
  });

  document.getElementById("assignNote").value = "";
  saveData();
  renderAll();
  showToast("Assigned '" + targetTitle + "' to " + journalist + "!");
}

function openAssignModal(index) {
  var s = stories[index];
  document.getElementById("quickIndex").value = index;
  document.getElementById("quickTitle").innerText = s.title;
  document.getElementById("quickWriter").value = s.assigned;
  document.getElementById("quickDate").value = s.deadline || "2026-11-07";
  document.getElementById("quickPriority").value = s.priority;
  document.getElementById("quickNote").value = "";
  document.getElementById("assignModal").hidden = false;
}

function closeAssignModal() {
  document.getElementById("assignModal").hidden = true;
}

function saveQuickAssign(event) {
  event.preventDefault();

  if (currentRole === "Journalist") {
    showToast("Access Denied: Only Editor or Chief Editor can reassign stories!");
    return;
  }

  var idx = parseInt(document.getElementById("quickIndex").value);
  var newJournalist = document.getElementById("quickWriter").value;
  var newDeadline = document.getElementById("quickDate").value;
  var newPriority = document.getElementById("quickPriority").value;
  var note = document.getElementById("quickNote").value.trim();

  stories[idx].assigned = newJournalist;
  stories[idx].deadline = newDeadline;
  stories[idx].priority = newPriority;
  if (stories[idx].status === "Draft") stories[idx].status = "Pending";

  if (note) {
    comments.unshift({
      author: currentRole,
      role: "Editor",
      avatar: "assets/avatar-priya.jpg",
      text: "Reassigned '" + stories[idx].title + "' to " + newJournalist + ": " + note,
      time: "Just now"
    });
  }

  saveData();
  renderAll();
  closeAssignModal();
  showToast("Assigned '" + stories[idx].title + "' to " + newJournalist + "!");
}


// 11. ADD, EDIT & DELETE STORY FUNCTIONS
function openStoryModal() {
  document.getElementById("editIndex").value = "-1";
  document.getElementById("modalHeading").innerText = "Submit New Story";
  document.getElementById("popupTitle").value = "";
  document.getElementById("popupStatus").value = "Pending";
  document.getElementById("popupPriority").value = "High";
  document.getElementById("popupWriter").value = "Amit Singh";
  document.getElementById("popupImage").value = "assets/thumb-india-growth.jpg";
  document.getElementById("popupContent").value = "";
  document.getElementById("storyModal").hidden = false;
}

function editStory(index) {
  var s = stories[index];
  document.getElementById("editIndex").value = index;
  document.getElementById("modalHeading").innerText = "Edit Story";
  document.getElementById("popupTitle").value = s.title;
  document.getElementById("popupStatus").value = s.status;
  document.getElementById("popupPriority").value = s.priority;
  document.getElementById("popupWriter").value = s.assigned;
  document.getElementById("popupImage").value = s.thumb;
  document.getElementById("popupContent").value = s.body;
  document.getElementById("storyModal").hidden = false;
}

function closeStoryModal() {
  document.getElementById("storyModal").hidden = true;
}

function saveStoryModal(event) {
  event.preventDefault();
  var idx = parseInt(document.getElementById("editIndex").value);

  var newStory = {
    title: document.getElementById("popupTitle").value,
    status: document.getElementById("popupStatus").value,
    priority: document.getElementById("popupPriority").value,
    assigned: document.getElementById("popupWriter").value,
    thumb: document.getElementById("popupImage").value,
    body: document.getElementById("popupContent").value
  };

  if (currentRole === "Journalist" && (newStory.status === "Approved" || newStory.status === "Published")) {
    showToast("Journalists cannot directly Approve or Publish stories!");
    return;
  }

  if (idx === -1) {
    stories.unshift(newStory);
    showToast("New story submitted!");
  } else {
    stories[idx] = newStory;
    showToast("Story updated!");
  }

  saveData();
  renderAll();
  closeStoryModal();
}

function submitPageForm(event) {
  event.preventDefault();

  var storyObj = {
    title: document.getElementById("submitTitle").value,
    status: "Pending",
    priority: document.getElementById("submitPriority").value,
    assigned: document.getElementById("submitWriter").value,
    thumb: document.getElementById("submitImage").value,
    body: document.getElementById("submitContent").value
  };

  stories.unshift(storyObj);
  saveData();

  document.getElementById("submitTitle").value = "";
  document.getElementById("submitContent").value = "";

  showPage("dashboard");
  showToast("Story submitted to Editorial Desk!");
}

function deleteStory(index) {
  if (currentRole === "Journalist") {
    showToast("Only Editor or Chief Editor can delete stories!");
    return;
  }
  var removedTitle = stories[index].title;
  stories.splice(index, 1);
  saveData();
  renderAll();
  showToast("Deleted: " + removedTitle);
}


// 12. VIEW STORY & ROLE-BASED WORKFLOW PROGRESSION
function viewStory(index) {
  var s = stories[index];
  document.getElementById("previewTitle").innerText = s.title;

  var currentPos = workflowOrder.indexOf(s.status);
  var nextStage = (currentPos < workflowOrder.length - 1) ? workflowOrder[currentPos + 1] : null;

  var buttonsHTML = "<button class='gray-btn' onclick='closeViewModal(); openAssignModal(" + index + ")'>Assign Journalist</button> ";
  if (s.status !== "Editing" && s.status !== "Draft") {
    buttonsHTML += "<button class='gray-btn' onclick='sendToEditing(" + index + ")'>Request Revision</button> ";
  }
  if (nextStage) {
    buttonsHTML += "<button class='dark-btn' onclick='advanceStage(" + index + ")'>Move to " + nextStage + " →</button>";
  } else {
    buttonsHTML += "<span class='badge badge-published'>Published Live ✓</span>";
  }

  document.getElementById("previewBody").innerHTML =
    "<img src='" + s.thumb + "' class='view-banner' alt='Story Image'>" +
    "<p><strong>Status:</strong> <span class='badge " + getStatusBadgeClass(s.status) + "'>" + s.status + "</span> &nbsp; " +
    "<strong>Priority:</strong> <span class='badge " + getPriorityBadgeClass(s.priority) + "'>" + s.priority + "</span> &nbsp; " +
    "<strong>Assigned:</strong> " + s.assigned + "</p>" +
    "<div class='view-article'>" + s.body + "</div>" +
    "<div class='popup-buttons'>" + buttonsHTML + "</div>";

  document.getElementById("viewModal").hidden = false;
}

function closeViewModal() {
  document.getElementById("viewModal").hidden = true;
}

function advanceStage(index) {
  var s = stories[index];
  var pos = workflowOrder.indexOf(s.status);
  if (pos === -1 || pos >= workflowOrder.length - 1) return;

  var targetStage = workflowOrder[pos + 1];

  if (currentRole === "Journalist" && (targetStage === "Approved" || targetStage === "Published")) {
    showToast("Access Denied: Only Editor / Chief Editor can Approve or Publish!");
    return;
  }
  if (currentRole === "Editor" && targetStage === "Published") {
    showToast("Access Denied: Only Chief Editor can Publish stories live!");
    return;
  }

  s.status = targetStage;
  saveData();
  renderAll();
  closeViewModal();
  showToast("Moved '" + s.title + "' to " + targetStage + "!");
}

function sendToEditing(index) {
  if (currentRole === "Journalist") {
    showToast("Only Editors can request story revisions!");
    return;
  }
  stories[index].status = "Editing";
  saveData();
  renderAll();
  closeViewModal();
  showToast("Sent back to Editing stage for revision!");
}


// 13. SEARCH, FILTERS, COMMENTS & ROLE SWITCHER
function searchStories() {
  renderStories();
}

function filterStories(status, btnElement) {
  currentFilter = status;
  var buttons = document.querySelectorAll(".filter-btn");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }
  if (btnElement) btnElement.classList.add("active");
  renderStories();
}

function filterFromCard(status) {
  currentFilter = status;
  showPage("stories");
}

function showStageInfo(stageName) {
  showToast("Workflow Stage: " + stageName + " (Click 'View All' for full board)");
}

function addComment(event) {
  event.preventDefault();
  var parts = document.getElementById("commentUser").value.split("|");
  var message = document.getElementById("commentText").value;

  comments.unshift({
    author: parts[0],
    role: parts[1],
    avatar: parts[2],
    text: message,
    time: "Just now"
  });

  document.getElementById("commentText").value = "";
  saveData();
  renderComments();
  showToast("Comment posted!");
}

function changeRole() {
  currentRole = document.getElementById("roleSelect").value;
  showToast("Switched role to: " + currentRole);
}

function toggleProfileMenu() {
  var menu = document.getElementById("profileMenu");
  menu.hidden = !menu.hidden;
}

function resetDemoData() {
  stories = JSON.parse(JSON.stringify(defaultStories));
  comments = JSON.parse(JSON.stringify(defaultComments));
  currentFilter = "All";
  document.getElementById("searchInput").value = "";
  saveData();
  showPage("dashboard");
  showToast("Restored original demo data!");
}

// Start the app when page loads
renderAll();
