



var fansubData = "";
async function loadData(){
	//load fansub data
	await fetch("./data/fansubList.json?time=" + Date.now())
		.then(response => response.json())
		.then(data => fansubData = data)
		.catch(error => console.log(error));

	clearTable("alive")
	addRows("alive", fansubData.alive)
	bindHeadCheckbox("alive")

	clearTable("misc")
	addRows("misc", fansubData.misc)
	bindHeadCheckbox("misc")

	clearTable("dead")
	addRows("dead", fansubData.dead)
	bindHeadCheckbox("dead")

	bindRowCheckbox()

}


function bindHeadCheckbox(tableId){
	$(".js-check-all-"+tableId).on("click", function () {
	if ($(this).prop("checked")) {
		$('#'+tableId+' th input[type="checkbox"]').each(function () {
		$(this).prop("checked", true);
		$(this).closest("tr").addClass("active");
		});
		fansubData[tableId].forEach(function(item){
			item.selected = true;
		});
	} else {
		$('#'+tableId+' th input[type="checkbox"]').each(function () {
			$(this).prop("checked", false);
			$(this).closest("tr").removeClass("active");
		});
		fansubData[tableId].forEach(function(item){
			item.selected = false;
		});
	}
	});
}

function bindRowCheckbox(){
	$('tbody input[type="checkbox"]').on("click", function () {
		let ref = this.id.split("_")
		let collection = ref[0]
		let index = ref[1]
	if ($(this).closest("tr").hasClass("active")) {
		$(this).closest("tr").removeClass("active");
		fansubData[collection][index].selected = false;
	} else {
		$(this).closest("tr").addClass("active");
		fansubData[collection][index].selected = true;
	}
	});
}


function clearTable(tableId){
	table = document.getElementById(tableId);
	empty_tbody = document.createElement('tbody');
	table.replaceChild(empty_tbody, table.getElementsByTagName("tbody")[0]);
}


function addRows(tableId, elements){

	// "website":"https://aegistranding.wordpress.com/",
	// "name":"Aegi Stranding",
	// "type":"",
	// "facebook":"",
	// "twitter":"",
	// "telegramChannel":"",
	// "telegramGroup":"",
	// "discord":"",
	// "otherLinks":[],
	// "torrentSourceUrls":[]

	table = document.getElementById(tableId);
	tbody = table.getElementsByTagName("tbody")[0];

	// 	table = document.getElementById(tableId);
	// 	tbody = table.getElementsByTagName("tbody")[0];
	// 	trs = tbody.children
	// 	let i=0;

	// 	}
	// }
	let i=0;
	for (i=0; i<elements.length; i++){

		let itemId = tableId + "_"  + i;
		let website = elements[i].website;
		let fansubName = elements[i].name;
		// let facebook
		// let twitter
		// let telegramChannel
		// let telegramGroup
		// let discord
		// let otherLinks
		// let torrentSourceUrls

		// fansubName = obj.fansubName;
		// url = obj.url;
		social = buildSocial();
		other = elements[i].otherLinks.join("<br>");
		selected = elements[i].selected ?? false

		var emptyRow = `
		<tr class="spacer">
			<td colspan="100"></td>
		</tr>
		`;
		row = tbody.insertRow(-1);
		row.innerHTML = emptyRow;
		row.classList.add("spacer");

		var baseRow = `
		<tr>
			<th scope="row">
				<label class="control control--checkbox">
					<input type="checkbox" id="${itemId}" checked=${selected}>
					<div class="control__indicator"></div>
				</label>
			</th>
			<td>${fansubName}</td>
			<td><a href="${website}">${website}</a></td>
			<td>${social}</td>
			<td>${other}</td>
		</tr>
		`;
		row = tbody.insertRow(-1);
		row.innerHTML = baseRow;
		if (selected){
			row.classList.add("active");
		}
	}
}

function buildSocial(){
	return "";
}



function buildSearchLink(type){
	let searchLink = "https://www.google.com/search?q=";
	searchLink += document.getElementById("search").value;
	searchLink +=" site:"
	let websites = [];
	let torrents = [];
	fansubData.alive.forEach(function(item){
		if (item.selected){
			websites.push(item.website.replace("https://www.",'').replace("http://www.",'').replace("https://",'').replace("http://",'').replace("www.",''))
			torrents=torrents.concat(item.torrentSourceUrls)
		}
	});
	fansubData.misc.forEach(function(item){
		if (item.selected){
			websites.push(item.website.replace("https://www.",'').replace("http://www.",'').replace("https://",'').replace("http://",'').replace("www.",''))
			torrents=torrents.concat(item.torrentSourceUrls)
		}
	});
	fansubData.dead.forEach(function(item){
		if (item.selected){
			websites.push(item.website.replace("https://www.",'').replace("http://www.",'').replace("https://",'').replace("http://",'').replace("www.",''))
			torrents=torrents.concat(item.torrentSourceUrls)
		}
	});

	switch (type){
		case "websites":
			searchLink += websites.join(" OR site:");
			break;
		case "torrents":
			searchLink += torrents.join(" OR site:");
			break;
		case "all":
			searchLink += websites.concat(torrents).join(" OR site:");
		default:
	}
	console.log(searchLink);
	window.open(searchLink, '_blank').focus();

}
