// Initialize lostItems if not in localStorage
let lostItems = JSON.parse(localStorage.getItem("lostItems")) || [];

const admin={
    name: "123",
    password : "123"
} //admin account name and password

function ResetLocalStorage() {
    localStorage.clear();    
    lostItems = [];          
}

function test_code() {
    let lostItem = JSON.parse(localStorage.getItem("lostItems")) || [];
    if (lostItem.length > 1) {
        let items = lostItem;
        console.log(items[0].Pictureid);
    } else {
        console.log("Insufficient items in the lostItems array.");
    }
}


function DeleteData(event) {
    const buttonid = event.target.id;
    var itemID = buttonid.replace(/^\D+/g, "") //get itemid by Regex (credit)
    itemID=parseInt(itemID)-1
    let lostItems = JSON.parse(localStorage.getItem("lostItems")) || [];
            lostItems[itemID]=null;
            localStorage.setItem("lostItems", JSON.stringify(lostItems));
            adminTable()
    }

    function get_data() {
        console.log("test");
    
        let fileInput = document.querySelector('input[type=file]');
        let pictureid = "No Image"; // Default if no file is selected
    
        if (fileInput.files.length) {
            let file = fileInput.files[0];
            let reader = new FileReader();
    
            reader.onload = function () {
                pictureid = reader.result.replace("data:", "").replace(/^.+,/, "");
                processNewItem(pictureid);
            };
    
            reader.readAsDataURL(file);
        } else {
            processNewItem(pictureid); // Continue even if no file is selected
        }
        window.location.href = "https://easygoing-jellyfish.static.domains/adminpage"; //jump to admin after submitting
        //window.event.returnValue=false;
      
      
      
    }
    
    function processNewItem(pictureid) {
        let lostItems = JSON.parse(localStorage.getItem("lostItems")) || [];
        let campus = document.querySelector('input[name="campus"]:checked')?.value;
        let floor = document.getElementById("floor").value;
        let item_type = document.getElementById("type").value;
        let currentlocation = document.querySelector('input[name="security room"]:checked')?.value;
        let now_time = new Date().toLocaleString();
        let newItemID = lostItems.length + 1;
        let description = document.getElementById("description").value;
        let status = "Pending";
    
        let newItem = {
            "ID": newItemID,
            "Itemtype": item_type,
            "Pictureid": pictureid,
            "Description": description || "No description",
            "RegisterTime": now_time,
            "FoundLocation": campus + " " + floor + "/F",
            "CurrentLocation": currentlocation,
            "Status": status,
            "SecurityQuestion": []
        };
    
        switch (item_type) {
            case "card":
                newItem.SecurityQuestion = [
                    "What is the name on the card?",
                    "What is the last 4 digit of id",
                    "What is the birth date of id"
                ];
                break;
            case "clothes":
                newItem.SecurityQuestion = ["What is the brand of the clothes?"];
                break;
            case "purse":
            case "bag":
                newItem.SecurityQuestion = [
                    "What is inside the Wallet/Purse/Bag?",
                    "Do you have any unique marks or scratches on it?",
                    "What brand is the Wallet/Purse?",
                    "Do you have a specific item inside (e.g., a lucky charm, photo)?"
                ];
                break;
            case "Electronic equipment":
                newItem.SecurityQuestion = [
                    "What is the lock screen wallpaper?",
                    "What apps or stickers are on the case?",
                    "Any identifying marks, scratches, or stickers?"
                ];
                break;
            case "Charging equipment":
                newItem.SecurityQuestion = [
                    "What device is this charger/cable used for?",
                    "Did the charger/cable have any specific damage or marks?",
                    "Is there a sticker, label, or name written on it?",
                    "What is the approximate battery capacity (mAh)?"
                ];
                break;
            case "accessory":
                newItem.SecurityQuestion = [
                    "Is there an engraving or custom marking? If yes, what does it say?",
                    "What material is it made of?",
                    "Did it have any damage or missing parts?",
                    "What brand and model are they?",
                    "Does it have a specific design, symbol, or logo?",
                    "Was there any pattern, charm, or decoration attached?"
                ];
                break;
            default:
                newItem.SecurityQuestion = ["No security questions available"];
        }
    
        lostItems.push(newItem);
        localStorage.setItem("lostItems", JSON.stringify(lostItems));
    
        console.log("New item added:", newItem);
        console.log("Security Questions:", newItem.SecurityQuestion);
        console.table(JSON.parse(localStorage.getItem("lostItems")));
    }

function validation(event){
    const buttonid = event.target.id;
    var itemID = buttonid.replace(/^\D+/g, "") //get itemid by Regex (credit)
    itemID=parseInt(itemID)-1
    let lostItems = JSON.parse(localStorage.getItem("lostItems")) || []

    if(buttonid.startsWith("approval")){
        lostItems[itemID].Status="Found"
        localStorage.setItem("lostItems", JSON.stringify(lostItems));
        adminTable()
    } else if(buttonid.startsWith("deny")){
        lostItems[itemID]=null;
        localStorage.setItem("lostItems", JSON.stringify(lostItems));
        adminTable()
    }

}

function ItemClassification(lostItemData){ //Classify if it's pending or found&claimed
    let pendingItems = [];
    let foundClaimedItems = [];

for (let i = 0; i < lostItemData.length; i++) {
    if (lostItemData[i] === null) continue;
    // Check if the status is "Pending"
    if (lostItemData[i].Status === "Pending") {
        pendingItems.push(lostItemData[i]); 
    }

    if (lostItemData[i].Status === "Found" || lostItemData[i].Status === "Claimed") {
        foundClaimedItems.push(lostItemData[i]);
    }
}
return {
    pendingItems: pendingItems,
    foundClaimedItems: foundClaimedItems
};
}

/*function imageToDataUri(base64, width, height, quality = 0.) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = `data:image/jpeg;base64,${base64}`;

        img.onload = function () {
            // create an off-screen canvas
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');

            // set the canvas dimensions to the target size
            canvas.width = width;
            canvas.height = height;

            // draw the image onto the canvas
            ctx.drawImage(img, 0, 0, width, height);

            // encode the resized image to a base64 string with reduced quality (compression)
            let compressedDataUri = canvas.toDataURL('image/jpeg', quality); // quality is between 0 and 1
            
            resolve(compressedDataUri); // return the compressed data URI
        };

    });
} */

function adminTable(){
    let lostItemData = JSON.parse(localStorage.getItem("lostItems")) || [];

    let pendingItemTable = document.getElementById("pendingItemTable"); //take html table
    let pendingTableHeader = pendingItemTable.querySelector("thead");  //take html tableheader
    let pendingTableBody = pendingItemTable.querySelector("tbody");  //take html table
    pendingTableBody.innerHTML = ''; //Clear and ready to replace for current item
    console.log("Current lost items: ", lostItemData); // Log to check if data is present
    let CategorizedItems = ItemClassification(lostItemData); //Classify of pending or foundClaimedItems
    console.log("Pending Items:", CategorizedItems.pendingItems);
    console.log("Found or Claimed Items:", CategorizedItems.foundClaimedItems)  

    if (CategorizedItems.pendingItems.length>0) { //Check if there's pending item
        pendingTableHeader.innerHTML = ` 
            <th>ID</th>
            <th>Item Type</th>
            <th>Picture</th>
            <th>Description</th>
            <th>Register Time</th>
            <th>Found Location</th>
            <th>Current Location</th>
            <th>Status</th>
            <th>Validation</th>
        `; 
        
        let items=CategorizedItems.pendingItems 
        for (let i=0;i<items.length;i++){
            pendingTableBody.innerHTML += createItemRow(items[i],true, false , false); //add pendingItems to table
    }

}

let foundClaimedItemTable = document.getElementById("foundClaimedItemTable");
let foundClaimedTableHeader = foundClaimedItemTable.querySelector("thead");
let foundClaimedTableBody = foundClaimedItemTable.querySelector("tbody");
foundClaimedTableBody.innerHTML = ''; //Clear and ready to replace for current item

if (CategorizedItems.foundClaimedItems.length>0) {  //Check if there's foundClaimedItems
    foundClaimedTableHeader.innerHTML = `
        <th>ID</th>
        <th>Item Type</th>
        <th>Picture</th>
        <th>Description</th>
        <th>Register Time</th>
        <th>Found Location</th>
        <th>Current Location</th>
        <th>Status</th>
        <th>Delete</th>
    `; 

    let items=CategorizedItems.foundClaimedItems 
    for (let i=0;i<items.length;i++){ //add foundClaimedItems to table
        foundClaimedTableBody.innerHTML += createItemRow(items[i],false, true , false); 
}

}
}
    
function PublicTable() {
    let lostItem = JSON.parse(localStorage.getItem("lostItems")) || [];

    let itemtable = document.getElementById("itemtable");
    console.log("Current lost items: ", lostItem); // Log to check if data is present
    let tableBody = itemtable.querySelector("tbody");
    tableBody.innerHTML = ''; // Clear the existing rows
    let items=lostItem
        for (let i = 0; i < items.length; i++) {
            if (items[i] === null) continue;
            if(items[i].Status=="Found" || items[i].Status=="Claimed"){
        tableBody.innerHTML += createItemRow(items[i], false, false) //add item to public table
                    }
        }
    }

/*
function display_test() {
    document.getElementById("location_show").innerHTML = localStorage.getItem("campus") || "N/A";
    document.getElementById("floor_show").innerHTML = localStorage.getItem("floor") || "N/A";
    document.getElementById("type_show").innerHTML = localStorage.getItem("type") || "N/A";
    document.getElementById("time_show").innerHTML = localStorage.getItem("time") || "N/A";
} */
function UploadDatabase() {
        const fileInput = document.getElementById('UploadedDatabase');
        
        // Check if a file is selected
        if (fileInput.files.length > 0) {
            let fr = new FileReader();

            fr.onload = function () {
                // Parse the JSON data from the file
                let fileData = JSON.parse(fr.result);
                let lostItems = JSON.parse(localStorage.getItem("lostItems")) || [];
                for (let i = 0; i < fileData.length; i++) {
                    fileData[i].ID = lostItems.length + i + 1; 
                    fileData[i].RegisterTime = new Date();
                    switch (fileData[i].Itemtype) {
                        case "card":
                            fileData[i].SecurityQuestion = [
                                "What is the name on the card?",
                                "What is the last 4 digits of the ID?",
                                "What is the birth date of the ID?"
                            ];
                            break;
                        case "clothes":
                            fileData[i].SecurityQuestion = [
                                "What is the brand of the clothes?"
                            ];
                            break;
                        case "purse":
                        case "bag":
                            fileData[i].SecurityQuestion = [
                                "What is inside the Wallet/Purse/Bag?",
                                "Do you have any unique marks or scratches on it?",
                                "What brand is the Wallet/Purse?",
                                "Do you have a specific item inside (e.g., a lucky charm, photo)?"
                            ];
                            break;
                        case "Electronic equipment":
                            fileData[i].SecurityQuestion = [
                                "What is the lock screen wallpaper?",
                                "What apps or stickers are on the case?",
                                "Any identifying marks, scratches, or stickers?"
                            ];
                            break;
                        case "Charging equipment":
                            fileData[i].SecurityQuestion = [
                                "What device is this charger/cable used for?",
                                "Did the charger/cable have any specific damage or marks?",
                                "Is there a sticker, label, or name written on it?",
                                "What is the approximate battery capacity (mAh)?"
                            ];
                            break;
                        case "accessory":
                            fileData[i].SecurityQuestion = [
                                "Is there an engraving or custom marking? If yes, what does it say?",
                                "What material is it made of?",
                                "Did it have any damage or missing parts?",
                                "What brand and model are they?",
                                "Does it have a specific design, symbol, or logo?",
                                "Was there any pattern, charm, or decoration attached?"
                            ];
                            break;
                        default:
                            fileData[i].SecurityQuestion = ["No security questions available"];
                    }
                }

                lostItems = lostItems.concat(fileData);
                localStorage.setItem("lostItems", JSON.stringify(lostItems));

                console.log("Data uploaded successfully.");
            };

            fr.readAsText(fileInput.files[0]);
        } else {
            console.log("No file selected.");
        }
    }
    
function ClaimDelete(){
    //function of deleting claimed item after 24h , may not do
}

function next_page() {
    window.location.href = "new_page.html";
}

/*function makeQRcode() {
    let qrCode;
    let itemID = document.getElementById("item-content").value;
    let qrCodebox = document.getElementById("qrcode");
    // Clear previous QR code
    qrCodebox.innerHTML = "";
    
    let verificationURL = `http://lostandfoundproject.site/verify?id=${itemID}`;

    function generateQrCode(content) {
        return new QRCode(qrCodebox, { // Use qrCodebox as the container
            text: content,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
        });
    }

    if (qrCode == null) {
        // Generate code initially
        qrCode = generateQrCode(verificationURL);
    } else {   
        // If code already generated, use the same object to regenerate the QR code
        qrCode.makeCode(verificationURL);
    }
} */

    function createItemRow(item, isPendingTable = false, foundClaimedItemsTable = false , isClaimTable= false) {
        let itemRow = `<tr id="${item.ID}">`;
        itemRow += `<td>${item.ID}</td>`;
        itemRow += `<td>${item.Itemtype}</td>`;
        itemRow += `<td><img src="data:image/jpg;base64,${item.Pictureid}" alt="Item Image" style="max-width: 100px; max-height: 100px;"></td>`;
        itemRow += `<td>${item.Description}</td>`;
        itemRow += `<td>${item.RegisterTime}</td>`;
        itemRow += `<td>${item.FoundLocation}</td>`;
        itemRow += `<td>${item.CurrentLocation}</td>`;
        itemRow += `<td>${item.Status}</td>`;
    
        // Add buttons if it's the pending table
        if (isPendingTable) {
            itemRow += `<td>
                <input type='button' id='approval${item.ID}' value='Approval' onclick='validation(event)'>
                <input type='button' id='deny${item.ID}' value='Deny' onclick='validation(event)'>
            </td>`;
        }
    

        if (foundClaimedItemsTable) {
            itemRow += `<td><input type='button' id='delete${item.ID}' value='Delete' onclick='DeleteData(event)'></td>`;
        }

        if(isClaimTable){
            itemRow += `<td>
            <input type='button' id='approval${item.ID}' value='Approval' onclick='ClaimValidation(event)'>
            <input type='button' id='deny${item.ID}' value='Deny' onclick='ClaimValidation(event)'>
        </td>`;
        }
        itemRow += "</tr>";
        return itemRow;
    }

    function ClaimItem(){
        let lostItems = JSON.parse(localStorage.getItem("lostItems")) || [];
        let itemid = document.getElementById("item-content").value;  
        let items=lostItems;
        itemid = parseInt(itemid)-1;  
        let ClaimTable=document.getElementById("ClaimTable");
        let ClaimTableHeader = ClaimTable.querySelector("thead");
        let ClaimTableBody = ClaimTable.querySelector("tbody");
        ClaimTableBody.innerHTML=""

            if (itemid >= 0 && itemid < lostItems.length && lostItems[itemid] != null) {
                document.getElementById("hint").innerHTML
                document.getElementById("hint").innerHTML="Item found."
    
                    ClaimTableHeader.innerHTML = ` 
                        <th>ID</th>
                        <th>Item Type</th>
                        <th>Picture</th>
                        <th>Description</th>
                        <th>Register Time</th>
                        <th>Found Location</th>
                        <th>Current Location</th>
                        <th>Status</th>
                        <th>Validation</th>
                    `; 
        ClaimTableBody.innerHTML += createItemRow(lostItems[itemid],false,false , true);
        document.getElementById("QuestionHeader").innerHTML="Security Question"
        document.getElementById("Question").innerHTML=""
        for (let i=0;i<lostItems[itemid].SecurityQuestion.length;i++){
            document.getElementById("Question").innerHTML+=lostItems[itemid].SecurityQuestion[i]+"<br>";
        }
    
    
    
            } else {
                console.log("Item not found.");
                document.getElementById("hint").innerHTML="Item not found." //div hint show item not found
            }
        }
 

function ClaimValidation(event){
    const buttonid = event.target.id;
    var itemID = buttonid.replace(/^\D+/g, "") //get itemid by Regex (credit)
    itemID=parseInt(itemID)-1
    let lostItems = JSON.parse(localStorage.getItem("lostItems")) || []
    let ClaimTable=document.getElementById("ClaimTable");
    let ClaimTableHeader = ClaimTable.querySelector("thead");
    let ClaimTableBody = ClaimTable.querySelector("tbody");
  
    if(buttonid.startsWith("approval")){
        lostItems[itemID].Status="Claimed"
        localStorage.setItem("lostItems", JSON.stringify(lostItems));
        document.getElementById("hint").innerHTML="Item has been Retrieved"
        ClaimTableHeader.innerHTML=""
        ClaimTableBody.innerHTML=""
        document.getElementById("QuestionHeader").innerHTML=""
        document.getElementById("Question").innerHTML=""
    } else if(buttonid.startsWith("deny")){
        ClaimTableHeader.innerHTML=""
        ClaimTableBody.innerHTML=""
        document.getElementById("QuestionHeader").innerHTML=""
        document.getElementById("Question").innerHTML=""
        document.getElementById("hint").innerHTML="Item has Not been Retrieved and Sent Back To The Table"
    }
}

function AdminLogin(){
    let name=document.getElementsByName("name")[0].value
    let password=document.getElementsByName("password")[0].value
    if (name == admin.name && password!==admin.password){
        alert("Wrong Password. Please enter again");
    } else if(name !== admin.name && password==admin.password) {
        alert("Wrong Name. Please enter again");
    } else if (name !== admin.name && password !==admin.password) {
        alert("Wrong Name and Wrong Password. Please enter again");
    } else {
        window.location.href = "https://easygoing-jellyfish.static.domains/adminpage"; //change the website
        window.event.returnValue=false;
    }
}

/*function search_from_table() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("itemtable");
    let tbody = table.querySelector("tbody"); // Select tbody
    tr = tbody.getElementsByTagName("tr"); // Select rows inside tbody

    // Loop through all table rows and hide those that don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[3]  ; // Search in the description
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";  // Show row
            } else {
                tr[i].style.display = "none"; // Hide row
            }
        }
    }
}

function type_filter() {
    var choice, filter, table, tr, td, i, txtValue;
    choice = document.getElementById("filter_type");
    filter = choice.value.toUpperCase();
    table = document.getElementById("itemtable");
    let tbody = table.querySelector("tbody");
    tr = tbody.getElementsByTagName("tr");
    if (filter != "ALL") {
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[1];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    } else {
        for (i = 0; i < tr.length; i++) {
            tr[i].style.display = "";
        }
    }
}*/

function filter_table() {
    var input, search_filter, choice, item_type_filter, table, tr ,i;
    input = document.getElementById("myInput");
    search_filter = input.value.toUpperCase();
    choice = document.getElementById("filter_type");
    item_type_filter = choice.value.toUpperCase();

    table = document.getElementById("itemtable");
    let tbody = table.querySelector("tbody");

    tr = tbody.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        let type_Td = tr[i].getElementsByTagName("td")[1];
        let desc_td = tr[i].getElementsByTagName("td")[3];
        if (type_Td && desc_td) {
            let typeTxtValue = type_Td.textContent || type_Td.innerText;
            let descTxtValue = desc_td.textContent || desc_td.innerText;

            // Apply filter and search criteria
            if ((item_type_filter === "ALL" || typeTxtValue.toUpperCase().indexOf(item_type_filter) > -1) &&
                descTxtValue.toUpperCase().indexOf(search_filter) > -1) {
                    tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}


function item_date_order() {
    var choice, table, tbody, tr;
    choice = document.getElementById("time_order");
    table = document.getElementById("itemtable");


    let lostItem = JSON.parse(localStorage.getItem("lostItems")) || [];

    let itemtable = document.getElementById("itemtable");
    let tableBody = itemtable.querySelector("tbody");
    tableBody.innerHTML = ''; // Clear the existing rows
    let items=lostItem
    
    tbody = table.querySelector("tbody");
    tr = tbody.getElementsByTagName("tr");

    if (choice.value == "descending") {
        //let sortedRows = Array.from(tr).reverse(); // Reverse the order of rows
        for (let i = 0; i < tr.length; i++) {
            tr[i].style.display = "none"; // Hide all rows first
        }        
        for (let i =  items.length-1 ; i >=  0; i--) {
            if (items[i] === null) continue;
            if(items[i].Status=="Found" || items[i].Status=="Claimed"){
            tableBody.innerHTML += createItemRow(items[i], false, false) //add item to public table
            }
        }
    } else {
        for (let i = 0; i < items.length; i++) {
            if (items[i] === null) continue;
            if(items[i].Status=="Found" || items[i].Status=="Claimed"){
            tableBody.innerHTML += createItemRow(items[i], false, false) //add item to public table
            }
        }
    }
}