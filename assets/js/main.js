



var fansubData = "";
async function loadData(){
	//load fansub data
	// await fetch("./data/fansubList.json?time=" + Date.now())
	//fetch directly from github
	await fetch("https://raw.githubusercontent.com/dvd14986/ifs_italian_fansub_search/master/data/fansubList.json?time=" + Date.now())
		.then(response => response.json())
		.then(data => fansubData = data)
		.catch(error => console.log(error));

	document.getElementById("info").innerText = fansubData.last_update;

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
	let table = document.getElementById(tableId);
	let empty_tbody = document.createElement('tbody');
	table.replaceChild(empty_tbody, table.getElementsByTagName("tbody")[0]);
}


function addRows(tableId, elements){
	let table = document.getElementById(tableId);
	let tbody = table.getElementsByTagName("tbody")[0];

	let i=0;
	for (i=0; i<elements.length; i++){

		let itemId = tableId + "_"  + i;
		let websiteAndSocial = buildWebsiteAndSocial(elements[i]);
		let fansubName = elements[i].name;

		// fansubName = obj.fansubName;
		// url = obj.url;
		let rss = buildRSS(elements[i].rss);
		let torrent = buildTorrent(elements[i].torrentSourceUrls);
		let note = elements[i].note
		let selected = elements[i].selected ?? false

		let emptyRow = `
		<tr class="spacer">
			<td colspan="100"></td>
		</tr>
		`;
		let row = tbody.insertRow(-1);
		row.innerHTML = emptyRow;
		row.classList.add("spacer");
		let checkedElement = selected ? "checked=true" : "";


		let baseRow = `
		<tr>
			<th scope="row">
				<label class="control control--checkbox">
					<input type="checkbox" id="${itemId}" ${checkedElement}>
					<div class="control__indicator"></div>
				</label>
			</th>
			<td class="name_col">${fansubName}</td>
			<td class="left_border">${websiteAndSocial}</td>
			<td class="left_border">${torrent}</td>
			<td class="left_border">${rss}</td>
			<td class="left_border">${note}</td>
		</tr>
		`;
		row = tbody.insertRow(-1);
		row.innerHTML = baseRow;
		if (selected){
			row.classList.add("active");
		}
	}
}

function buildWebsiteAndSocial(element){
	let result = ""
	if (element.website){
		result = `<a title='Website - ${element.website}' href="${element.website}" target="_blank"><img src='assets/icons/web.png'></a>`
	}
	let linksArray = []
	linksArray.push(
		element.facebook,
		element.instagram,
		element.twitter,
		element.telegramChannel,
		element.telegramGroup,
		element.discord
	)
	linksArray = linksArray.concat(element.otherLinks)

	linksArray.forEach(link => {
		if (link){
			result += setLinkIcon(link)
		}
	});
	return result
}

function buildRSS(rss){
	let result = ""
	rss.forEach(link => {
		result += setLinkIcon(link, "rss")
	});
	return result
}

function buildTorrent(torrentUrls){
	let result = ""
	torrentUrls.forEach(link => {
		result += setLinkIcon(link, "torrent")
	});
	return result
}


let linkToIcons ={
	"anidex" : ["anidex.info/"],
	"dailymotion" : ["dailymotion.com"],
	"discord" : ["discord.gg","discord.com","discordapp.com"],
	"facebook" : ["facebook.com","fb.me/"],
	"github" : ["github.io/"],
	"instagram" : ["instagram.com"],
	"line" : ["line.me/"],
	"nyaa" : ["nyaa.si/"],
	"rss" : [],
	"telegram" : ["t.me/"],
	"tiktok" : ["tiktok.com/"],
	"twitter" : ["twitter.com"],
	"wattpad" : ["wattpad.com"],
	"wechat" : ["weixin://dl/"],
	"youtube" : ["youtube.com"]
}

function setLinkIcon(link, default_icon="link"){
	const iconPath ="assets/icons/"
	let tooltipText = null
	let src = null

	for (const [key, value] of Object.entries(linkToIcons)) {
		for (let i = 0; i < value.length; i++) {
			if (link.includes(value[i])){
				tooltipText = key[0].toUpperCase() + key.substring(1) + " - " + link // capitalize first letter of key
				src = iconPath + key + ".png"
				break
			}
		}
		if (tooltipText){
			//already found solution
			break
		}
	}
	if (!tooltipText){
		//no icon found, set default
		tooltipText = link
		src = iconPath + default_icon + ".png"	
	}

	let result = `<a title='${tooltipText}' href="${link}" target="_blank"><img src='${src}'></a>`
	return result
}


function buildSearchLink(type){
	let destParentDiv = document.getElementById("divResults")
	let destDiv = document.getElementById("divResultsLinks")
	let websites = [];
	let torrents = [];
	fansubData.alive.forEach(function(item){
		if (item.selected && item.website != ""){
			websites.push(clearLink(item.website))
			torrents=torrents.concat(item.torrentSourceUrls.map((t)=>{return clearLink(t)}))
		}
	});
	fansubData.misc.forEach(function(item){
		if (item.selected && item.website != ""){
			websites.push(clearLink(item.website))
			torrents=torrents.concat(item.torrentSourceUrls.map((t)=>{return clearLink(t)}))
		}
	});
	fansubData.dead.forEach(function(item){
		if (item.selected && item.website != ""){
			websites.push(clearLink(item.website))
			torrents=torrents.concat(item.torrentSourceUrls.map((t)=>{return clearLink(t)}))
		}
	});

	let baseLink = "https://www.google.com/search?q=";
	let intitle = "intitle:"
	let searchValue = document.getElementById("search").value;
	let searchUrlsWebSites = ""
	let searchUrlsTorrent = ""
	
	const chunkSize = 30; //google site limit is 32
	let resultsLinks = [];
	let resultCounter = 1
	switch (type){
		case "websites":
			for (let i = 0; i < websites.length; i += chunkSize) {
				searchUrlsWebSites = "";
				chunk = websites.slice(i, i + chunkSize);
				searchUrlsWebSites = chunk.join(" OR site:");
				searchLinkWeb = `<a href="` + baseLink + intitle + searchValue + " site:" + searchUrlsWebSites + `" target="_blank">${searchValue.substr(0, 5)}... ${resultCounter}</a>`
				resultsLinks.push(searchLinkWeb)
				resultCounter++
			}
			//window.open(searchLinkWeb, '_blank').focus();
			break;
		case "torrents":
			for (let i = 0; i < torrents.length; i += chunkSize) {
				searchUrlsTorrent = "";
				chunk = torrents.slice(i, i + chunkSize);
				searchUrlsTorrent = chunk.join(" OR site:");
				searchLinkTorrent = `<a href="` + baseLink + searchValue + " site:" + searchUrlsTorrent + `" target="_blank">${searchValue.substr(0, 5)}... ${resultCounter}</a>`
				resultsLinks.push(searchLinkTorrent)
				resultCounter++
			}
			break;
		case "all":
			for (let i = 0; i < websites.length; i += chunkSize) {
				searchUrlsWebSites = "";
				chunk = websites.slice(i, i + chunkSize);
				searchUrlsWebSites = chunk.join(" OR site:");
				searchLinkWeb = `<a href="` + baseLink + intitle + searchValue + " site:" + searchUrlsWebSites + `" target="_blank">${searchValue.substr(0, 5)}... ${resultCounter}</a>`
				resultsLinks.push(searchLinkWeb)
				resultCounter++
			}
			for (let i = 0; i < torrents.length; i += chunkSize) {
				searchUrlsTorrent = "";
				chunk = torrents.slice(i, i + chunkSize);
				searchUrlsTorrent = chunk.join(" OR site:");
				searchLinkTorrent = `<a href="` + baseLink + searchValue + " site:" + searchUrlsTorrent + `" target="_blank">${searchValue.substr(0, 5)}... ${resultCounter}</a>`
				resultsLinks.push(searchLinkTorrent)
				resultCounter++
			}
		default:
	}

	destDiv.innerHTML = "<h5>" + resultsLinks.join(" | ") + "</h5>"
	destParentDiv.hidden = false;
	destDiv.hidden = false;
}


function clearLink(link){
	return link.replace("https://www.",'').replace("http://www.",'').replace("https://",'').replace("http://",'').replace("www.",'');
}
