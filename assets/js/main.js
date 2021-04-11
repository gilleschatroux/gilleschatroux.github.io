/** @function hide
 * @param {Element[]} table - An array of HTML table elements.
 * @description Hide a collection of table elements
 */
function hide (table) {
	// On verifie si on a recu une seule table ou plusieurs
	if (table.length === undefined) {
		//table.style.opacity = '0'
		table.style.display = 'none'
	} else {
		const tables = table
		tables.forEach(table => {
			//table.style.opacity = '0'
			table.style.display = 'none'
		});
	}
}

/** @function show
 * @param {Element[]} table - An array of HTML table elements.
 * @description Show a collection of table elements
 */
function show (table) {
	// On verifie si on a recu une seule table ou plusieurs
	if (table.length === undefined) {
		table.style.display = 'table'
		//table.style.opacity = '1'
	} else {
		const tables = table
		tables.forEach(table => {
			table.style.display = 'table'
			//table.style.opacity = '1'
		});
	}
}

/** @function start
 * @description Hide the #intro HTML element in 2 seconds and show the first table
 */
function start () {
	const intro = document.getElementById('intro')
	show(tables[0])
	intro.style.opacity = '0'
	setTimeout(() => {
		intro.style.display = 'none'
	}, 2000)
}

/** @function nextStep
 * @param {number} stepToHide - A number that reprents the HTML table's index to hide
 * @param {number} stepToShow - A number that reprents the HTML table's index to show
 * @description Hide a HTML table and show an other
 */
function nextStep (stepToHide, stepToShow) {
	hide(tablesArray[stepToHide])
	if (stepToShow < steps) {
		show(tablesArray[stepToShow])
	}
}

/** @function previousStep
 * @param {number} stepToHide - A number that reprents the HTML table's index to hide
 * @param {number} stepToShow - A number that reprents the HTML table's index to show
 * @description Hide a HTML table and show an other
 */
function previousStep (stepToHide, stepToShow) {
	hide(tablesArray[stepToHide])
	if (stepToShow >= 0) {
		show(tablesArray[stepToShow])
	}
}

/** @function getInputsDatas
 * @param {NodeListOf<Element>} inputs - A NodeList of HTML input elements.
 * @description Processes a collection of inputs to return its id and value in an array 
 * @returns {[key: string, value: number][]} array that contains an array for each input with its id property as key and its value as value
 */
function getInputsDatas (inputs) {
	if (inputs.length !== undefined) {
		const datas = []
		for (let i = 0; i < inputs.length; i++) {
			const element = inputs[i];
			const id = element.id
			let value = element.value
			!parseFloat(value) ? value = 0 : value = parseFloat(value)
			datas[id] = value
		}
		return datas
	}
}

/** @function roundify
 * @param {number} value - A number to round
 * @description rounds a decimal value to 2 decimal places
 */
function roundify (value) {
	return Math.round(value * 100) / 100
}

/** @function createResultTable
 * @description Gets the template element innerHTML, uses recetteDatas to replace the missing values and appends the result in the div#result element
 */
function createResultTable () {
	console.log("On est censé avoir la recette complète (coté magasin)")
	console.log(recetteDatas)

	const result = document.getElementById('result')
	const template = document.querySelector('template')
	let templateString = template.innerHTML

	let recetteNetteCA = recetteDatas.ecartTable.recetteNetteCA
	recetteNetteCA = recetteNetteCA !== 0 ? recetteNetteCA : ""
	templateString = templateString.replace("{{RECETTE NETTE CA}}", recetteNetteCA);

	let prelevSachetBleu = recetteDatas.especesTable.prelevSachetBleu
	prelevSachetBleu = prelevSachetBleu !== 0 ? prelevSachetBleu : ""
	templateString = templateString.replace("{{PRELEVEMENTS SACHETS BLEUS}}", prelevSachetBleu);

	let prelevCaisseAuto = recetteDatas.especesTable.prelevCaisseAuto
	prelevCaisseAuto = prelevCaisseAuto !== 0 ? prelevCaisseAuto : ""
	templateString = templateString.replace("{{PRELEVEMENTS CAISSE AUTO}}", prelevCaisseAuto);

	let totalPrelevements = recetteDatas.especesTable.totalPrelevements
	totalPrelevements = totalPrelevements !== 0 ? totalPrelevements : ""
	templateString = templateString.replace("{{TOTAL PRELEVEMENTS}}", totalPrelevements);

	let avoirsCaisse = recetteDatas.especesTable.avoirsCaisse
	avoirsCaisse = avoirsCaisse !== 0 ? avoirsCaisse : ""
	templateString = templateString.replace("{{AVOIRS CAISSES}}", avoirsCaisse);
	
	let apportCaisseAuto = recetteDatas.especesTable.apportCaisseAuto
	apportCaisseAuto = apportCaisseAuto !== 0 ? apportCaisseAuto : ""
	templateString = templateString.replace("{{APPORT CAISSES AUTO}}", apportCaisseAuto);

	let apportAccueil = recetteDatas.especesTable.apportAccueil
	apportAccueil = apportAccueil !== 0 ? apportAccueil : ""
	templateString = templateString.replace("{{APPORT ACCUEIL}}", apportAccueil);
	
	let perteProfit = recetteDatas.especesTable.perteProfit
	perteProfit = perteProfit !== 0 ? perteProfit : ""
	templateString = templateString.replace("{{PERTES/PROFITS}}", perteProfit);

	let totalEspeces = recetteDatas.especesTable.totalEspeces
	totalEspeces = totalEspeces !== 0 ? totalEspeces : ""
	templateString = templateString.replace("{{TOTAL ESPECES}}", totalEspeces);
	
	result.innerHTML = templateString
}

function onClickStartButton () {
	start()
}

function onClickReturnButtons () {
	thisTable = this.parentNode.parentNode.parentNode.parentNode
	thisStep = tablesArray.indexOf(thisTable)
	previousStep(thisStep, thisStep-1)
}

/** Traitement des données de la table #especesTable
 * -------------------------------------------------
 * Variables à calculer
 *  - totalEspeces = espece - nonRendu
 *  - avoirCaisseClass = totalEspece - prelevSachetBleu - prelevCaisseAuto + perteProfit
 */
function onClickEspecesButton () {
	const inputs = document.querySelectorAll('#especesTable input')
	const datas = getInputsDatas(inputs)

	let totalPrelevements = datas.prelevSachetBleu + datas.prelevCaisseAuto
	datas['totalPrelevements'] = totalPrelevements

	let totalEspeces = datas.especes - datas.nonRendu
	totalEspeces = roundify(totalEspeces)
	datas['totalEspeces'] = totalEspeces

	let avoirsCaisse = datas.totalEspeces - datas.prelevSachetBleu - datas.prelevCaisseAuto - datas.apportCaisseAuto - datas.apportAccueil + datas.perteProfit
	avoirsCaisse = roundify(avoirsCaisse)
	datas['avoirsCaisse'] = avoirsCaisse

	recetteDatas['especesTable'] = datas

	thisTable = this.parentNode.parentNode.parentNode.parentNode
	thisStep = tablesArray.indexOf(thisTable)
	nextStep(thisStep, thisStep+1)
}

/** Traitement des données de la table #chequesTable
 * -------------------------------------------------
 * Variables à calculer
 *  - totalCheque = chequesNorm + chequesManu
 *  - totalNbCheque = nbChequesNorm + nbChequesManu
 */
function onClickChequesButton () {
	const inputs = document.querySelectorAll('#chequesTable input')
	const datas = getInputsDatas(inputs)

	let totalCheque = datas.chequesNorm + datas.chequesManu
	totalCheque = roundify(totalCheque)
	datas['totalCheque'] = totalCheque

	let totalNbCheque = datas.nbChequesNorm + datas.nbChequesManu
	datas['totalNbCheque'] = totalNbCheque

	recetteDatas['chequesTable'] = datas

	thisTable = this.parentNode.parentNode.parentNode.parentNode
	thisStep = tablesArray.indexOf(thisTable)
	nextStep(thisStep, thisStep+1)
}

/** Traitement des données de la table #cartesTable
 * ------------------------------------------------
 * Variables à calculer
 *  - totalCb = cb - cbRemb
 *  - totalCbManu = cbManu - cbManuRemb
 *  - totalAmex = amex - amexRemb
 *  - totalCbSansContact = cbSansContact - cbSansContactRemb
 *  - totalTitreRes3c = titreRes3c - titreRes3cRemb
 *  - totalTitreRes4c = titreRes4c - titreRes4cRemb
 *  - totalTitreRes3cScvx = titreRes3cScvx - titreRes3cScvxRemb
 *  - totalTitreRes4cScvx = titreRes4cScvx - titreRes4cScvxRemb
 *  - totalTitreRes = totalTitreRes3c + {...} + totalTitreRes4cScvx
 *  - totalCarte = totalCb + totalCbManu + totalAmex + totalCbSansContact + totalTitreRes + paieLigneCourseU + cbLivrCourseU + paieLigneLocU + eCommerce
 */
function onClickCartesButton () {
	const inputs = document.querySelectorAll('#cartesTable input')
	const datas = getInputsDatas(inputs)

	let totalCb = datas.cb - datas.cbRemb
	totalCb = roundify(totalCb)
	datas['totalCb'] = totalCb

	let totalCbManu = datas.cbManu - datas.cbManuRemb
	totalCbManu = roundify(totalCbManu)
	datas['totalCbManu'] = totalCbManu

	let totalAmex = datas.amex - datas.amexRemb
	totalAmex = roundify(totalAmex)
	datas['totalAmex'] = totalAmex

	let totalCbSansContact = datas.cbSansContact - datas.cbSansContactRemb
	totalCbSansContact = roundify(totalCbSansContact)
	datas['totalCbSansContact'] = totalCbSansContact

	let totalTitreRes3c = datas.titreRes3c - datas.titreRes3cRemb
	totalTitreRes3c = roundify(totalTitreRes3c)
	datas['totalTitreRes3c'] = totalTitreRes3c

	let totalTitreRes4c = datas.titreRes4c - datas.titreRes4cRemb
	totalTitreRes4c = roundify(totalTitreRes4c)
	datas['totalTitreRes4c'] = totalTitreRes4c

	let totalTitreRes3cScvx = datas.titreRes3cScvx - datas.titreRes3cScvxRemb
	totalTitreRes3cScvx = roundify(totalTitreRes3cScvx)
	datas['totalTitreRes3cScvx'] = totalTitreRes3cScvx

	let totalTitreRes4cScvx = datas.titreRes4cScvx - datas.titreRes4cScvxRemb
	totalTitreRes4cScvx = roundify(totalTitreRes4cScvx)
	datas['totalTitreRes4cScvx'] = totalTitreRes4cScvx

	let totalTitreRes = datas.totalTitreRes3c + datas.totalTitreRes4c + datas.totalTitreRes3cScvx + datas.totalTitreRes4cScvx
	datas['totalTitreRes'] = totalTitreRes

	let totalCarte = datas.totalCb + datas.totalCbManu + datas.totalAmex + datas.totalCbSansContact + datas.totalTitreRes + datas.paieLigneCourseU + datas.cbLivrCourseU + datas.paieLigneLocU + datas.eCommerce
	totalCarte = roundify(totalCarte)
	datas['totalCarte'] = totalCarte

	recetteDatas['cartesTable'] = datas

	thisTable = this.parentNode.parentNode.parentNode.parentNode
	thisStep = tablesArray.indexOf(thisTable)
	nextStep(thisStep, thisStep+1)
}

/** Traitement des données de la table #bonsTable
 * ----------------------------------------------
 * Variables à calculer
 *  - bonUOccasReemis = prelevUOccas - caUOccas
 *  - bonReduc = bonReducStat + ecobonStat - ecobonTicket
 *  - totalChequeResto = ticketService + chequeService + ticketRestaurant + chequeDejeuner
 *  - totalChequeCadeau = kadeo + tirGroupe + cadoCheque + bonBest
 *  - totalbon = paieEuroCarteU + repriseEuroCarteU + baMag + carteCadeauU + bonULocal + bonUNational + baManu + bonRecyclage + bonUOccasRepris - bonUOccasReemis + bonReduc + ecobonTicket + bonEurocycleur + totalChequeResto + totalChequeCadeau + paci + paca + bonAchatCe
 */
function onClickBonsButton () {
	const inputs = document.querySelectorAll('#bonsTable input')
	const datas = getInputsDatas(inputs)

	let bonUOccasReemis = datas.prelevUOccas - datas.caUOccas
	bonUOccasReemis = roundify(bonUOccasReemis)
	datas['bonUOccasReemis'] = bonUOccasReemis

	let bonReduc = datas.bonReducStat + datas.ecobonStat - datas.ecobonTicket
	bonReduc = roundify(bonReduc)
	datas['bonReduc'] = bonReduc

	let totalChequeResto = datas.ticketService + datas.chequeService + datas.ticketRestaurant + datas.chequeDejeuner
	totalChequeResto = roundify(totalChequeResto)
	datas['totalChequeResto'] = totalChequeResto

	let totalChequeCadeau = datas.kadeo + datas.tirGroupe + datas.cadoCheque + datas.bonBest
	totalChequeCadeau = roundify(totalChequeCadeau)
	datas['totalChequeCadeau'] = totalChequeCadeau

	let totalbon = datas.paieEuroCarteU - datas.repriseEuroCarteU + datas.baMag + datas.carteCadeauU + datas.bonULocal + datas.bonUNational + datas.baManu + datas.bonRecyclage + datas.bonUOccasRepris - datas.bonUOccasReemis + datas.bonReduc + datas.ecobonTicket + datas.bonEurocycleur + datas.totalChequeResto + datas.totalChequeCadeau + datas.paci + datas.paca + datas.bonAchatCe
	totalbon = roundify(totalbon)
	datas['totalbon'] = totalbon

	recetteDatas['bonsTable'] = datas

	thisTable = this.parentNode.parentNode.parentNode.parentNode
	thisStep = tablesArray.indexOf(thisTable)
	nextStep(thisStep, thisStep+1)
}

/** Traitement des données de la table #creditsTable
 * -------------------------------------------------
 * Variables à calculer
 *  - totalCredit = creditSofinco + creditFinanco + paieDiffere
 */
function onClickCreditsButton () {
	const inputs = document.querySelectorAll('#creditsTable input')
	const datas = getInputsDatas(inputs)

	let totalCredit = datas.creditSofinco + datas.creditFinanco + datas.paieDiffere
	totalCredit = roundify(totalCredit)
	datas['totalCredit'] = totalCredit

	recetteDatas['creditsTable'] = datas

	thisTable = this.parentNode.parentNode.parentNode.parentNode
	thisStep = tablesArray.indexOf(thisTable)
	nextStep(thisStep, thisStep+1)
}

/** Traitement des données de la table #avoirsTable
 * ------------------------------------------------
 * Variables à calculer
 *  - avoirEmis = totalBonAvoir - avoirRepris
 */
function onClickAvoirsButton () {
	const inputs = document.querySelectorAll('#avoirsTable input')
	const datas = getInputsDatas(inputs)

	let avoirEmis = datas.totalBonAvoir - datas.avoirRepris
	avoirEmis = roundify(avoirEmis)
	datas['avoirEmis'] = avoirEmis

	recetteDatas['avoirsTable'] = datas

	thisTable = this.parentNode.parentNode.parentNode.parentNode
	thisStep = tablesArray.indexOf(thisTable)
	nextStep(thisStep, thisStep+1)
}

/** Traitement des données de la table #ecartTable
 * -----------------------------------------------
 * Variables à calculer
 *  - totalEncaiss = totalEspeces + totalCheque + totalCarte + totalbon + totalCredit + totalBonAvoir
 *  - ecartStat = totalStat - totalEncaiss
 *  - ecartCa = recetteNetteCA - totalStat
 */
function onClickEcartButton () {
	const inputs = document.querySelectorAll('#ecartTable input')
	const datas = getInputsDatas(inputs)

	let totalEncaiss = recetteDatas.especesTable.totalEspeces + recetteDatas.chequesTable.totalCheque + recetteDatas.cartesTable.totalCarte + recetteDatas.bonsTable.totalbon + recetteDatas.creditsTable.totalCredit + recetteDatas.avoirsTable.totalBonAvoir
	totalEncaiss = roundify(totalEncaiss)
	datas['totalEncaiss'] = totalEncaiss

	let ecartStat = datas.totalStat - datas.totalEncaiss
	ecartStat = roundify(ecartStat)
	datas['ecartStat'] = ecartStat

	let ecartCa = datas.recetteNetteCA - datas.totalStat
	ecartCa = roundify(ecartCa)
	datas['ecartCa'] = ecartCa

	recetteDatas['ecartTable'] = datas

	if (ecartStat !== 0) {
		alert("un ecart de " + ecartStat  + " a été trouvé entre le total des stats et le total des encaissements")
		return
	} 

	thisTable = this.parentNode.parentNode.parentNode.parentNode
	thisStep = tablesArray.indexOf(thisTable)
	nextStep(thisStep, thisStep+1)    
}

/** Traitement des données de la table #justifsTable
 * -------------------------------------------------
 * Variables à calculer
 *  - totalDifference = venteCarteCadeau + venteBaAccueil + clientCourseU10200 + clientUOccas10717 + enctPspStation + cliproTicketCode + soldeReserv106 + depotGarantLocU200
 *  - finalEcart = ecartCa + totalDifference
 */
function onClickJustifsButton () {
	const inputs = document.querySelectorAll('#justifsTable input')
	const datas = getInputsDatas(inputs)

	let totalDifference = datas.venteCarteCadeau + datas.venteBaAccueil + datas.clientCourseU10200 + datas.clientUOccas10717 + datas.enctPspStation + datas.cliproTicketCode + datas.soldeReserv106 + datas.depotGarantLocU200
	totalDifference = roundify(totalDifference)
	datas['totalDifference'] = totalDifference

	let finalEcart = recetteDatas.ecartTable.ecartCa + datas.totalDifference
	finalEcart = roundify(finalEcart)
	datas['finalEcart'] = finalEcart

	recetteDatas['justifsTable'] = datas

	thisTable = this.parentNode.parentNode.parentNode.parentNode
	thisStep = tablesArray.indexOf(thisTable)
	nextStep(thisStep, thisStep+1)

	createResultTable()
}

/* On récupère toutes les tables*/
const tables = document.querySelectorAll('.table')
const especesTable = document.getElementById('especesTable')
const chequesTable = document.getElementById('chequesTable')
const cartesTable = document.getElementById('cartesTable')
const bonsTable = document.getElementById('bonsTable')
const creditsTable = document.getElementById('creditsTable')
const avoirsTable = document.getElementById('avoirsTable')
const ecartTable = document.getElementById('ecartTable')
const justifsTable = document.getElementById('justifsTable')

/* On récupère tous les boutons */
const especesButton = document.getElementById('especesButton')
const chequesButton = document.getElementById('chequesButton')
const cartesButton = document.getElementById('cartesButton')
const bonsButton = document.getElementById('bonsButton')
const creditsButton = document.getElementById('creditsButton')
const avoirsButton = document.getElementById('avoirsButton')
const ecartButton = document.getElementById('ecartButton')
const justifsButton = document.getElementById('justifsButton')
const startButton = document.querySelector('#startButton')
const returnButtons = document.querySelectorAll('.return')

/* Gestion evenementielles pour chaque bouton */
especesButton.addEventListener('click', onClickEspecesButton)
chequesButton.addEventListener('click', onClickChequesButton)
cartesButton.addEventListener('click', onClickCartesButton)
bonsButton.addEventListener('click', onClickBonsButton)
creditsButton.addEventListener('click', onClickCreditsButton)
avoirsButton.addEventListener('click', onClickAvoirsButton)
ecartButton.addEventListener('click', onClickEcartButton)
justifsButton.addEventListener('click', onClickJustifsButton)

startButton.addEventListener('click', onClickStartButton)
returnButtons.forEach(returnButton => {
	returnButton.addEventListener('click', onClickReturnButtons)
})

const tablesArray = [...tables]
const steps = tablesArray.length

/* On se prépare un tableau pour y stocker toutes les données au fur et à mesure */
let recetteDatas = []

/* Lorsque le DOM est prêt */
document.addEventListener('DOMContentLoaded', function () {
	/* On cache toutes les tables */
	hide(tablesArray)
})