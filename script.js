const nameTagInput = document.getElementById("nameTag");
const puuidInput = document.getElementById("puuid");
const regionSelect = document.getElementById("region");
const hideUsernameCheckbox = document.getElementById("hideUsername");
const showRRChangeCheckbox = document.getElementById("showRRChange");
const uniqueColorCheckbox = document.getElementById("uniqueColor");
const platformSelect = document.getElementById("platform");
const generateButton = document.getElementById("generateButton");
const generatedUrl = document.getElementById("generatedUrl");
const copyIcon = document.getElementById("copyIcon");
const exampleResponse = document.getElementById("exampleResponse");
const modeSwitch = document.getElementById("modeSwitch");

generatedUrl.style.display = "none";
copyIcon.style.display = "none";
exampleResponse.style.display = "none";

generateButton.addEventListener("click", function () {
	if (!modeSwitch.checked && !nameTagInput.value.includes("#")) {
		return alert("Please enter a valid username in the format Name#Tag");
	}

	if (modeSwitch.checked && !puuidInput.value.includes("-")) {
		return alert("Please enter a valid PUUID");
	}

	const data = {
		username: nameTagInput.value,
		name: nameTagInput.value.split("#")[0],
		tag: nameTagInput.value.split("#")[1],
		puuid: puuidInput.value,
		region: regionSelect.value,
		onlyRank: hideUsernameCheckbox.checked,
		mmrChange: showRRChangeCheckbox.checked,
		uniqueColor: uniqueColorCheckbox.checked,
	};

	const url = generateUrl(data);
	generatedUrl.textContent = formatUrlForPlatform(
		url,
		platformSelect.value,
		data.uniqueColor
	);
	generatedUrl.style.display = "block";
	copyIcon.style.display = "inline-block";
	exampleResponse.style.display = "block";

	setExample(data);
});

copyIcon.addEventListener("click", function () {
	if (generatedUrl.textContent.length <= 0) return;
	navigator.clipboard.writeText(generatedUrl.textContent);
});

modeSwitch.addEventListener("change", function () {
	const nameTagGroup = document.getElementById("nameTagGroup");
	const puuidGroup = document.getElementById("puuidGroup");
	if (this.checked) {
		nameTagGroup.style.display = "none";
		puuidGroup.style.display = "block";
	} else {
		nameTagGroup.style.display = "block";
		puuidGroup.style.display = "none";
	}
});

function generateUrl(data) {
	const fixedName = encodeURIComponent(data.name.replace(" ", ""));
	const fixedTag = encodeURIComponent(data.tag);

	let url = modeSwitch.checked
		? "https://valorantrank-tan.vercel.app/valorant-puuid"
		: "https://valorantrank-tan.vercel.app/valorant";
	url += "/" + data.region;
	url += modeSwitch.checked
		? "/" + data.puuid
		: "/" + fixedName + "/" + fixedTag;

	const queryParams = [];
	if (data.onlyRank) queryParams.push("onlyRank=true");
	if (data.mmrChange) queryParams.push("mmrChange=true");

	if (queryParams.length > 0) {
		url += "?" + queryParams.join("&");
	}

	return url;
}

function formatUrlForPlatform(url, platform, uniqueColor) {
	let formattedUrl;
	switch (platform) {
		case "streamelements":
			formattedUrl = "$(customapi." + url + ")";
			break;
		case "nightbot":
		case "fossabot":
			formattedUrl = "$(customapi " + url + ")";
			break;
		case "streamlabs":
			formattedUrl = "{readapi." + url + "}";
			break;
		case "wizebot":
			formattedUrl = "$urlcall(" + url + ")";
			break;
		default:
			formattedUrl = url;
	}

	if (uniqueColor) {
		formattedUrl = "/me " + formattedUrl;
	}

	return formattedUrl;
}

function setExample(data) {
	let buffer = "";
	if (!data.onlyRank) {
		buffer += modeSwitch.checked ? "Name#Tag" : data.username;
		buffer += " [Immortal 2] : 120 RR";
	} else {
		buffer += "Immortal 2 : 120 RR";
	}
	if (data.mmrChange) buffer += " [-22]";
	exampleResponse.textContent = buffer;
}
