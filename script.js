 let footingCounter = 0;
        let allFootingResults = [];
        const SVG_SHAPES = {
            hooked: `<svg viewBox="0 0 100 20"><path d="M5 0 V 15 H 95 V 0" stroke="black" stroke-width="2" fill="none"/></svg>`,
            inverted_hooked: `<svg viewBox="0 0 100 20"><path d="M5 20 V 5 H 95 V 20" stroke="black" stroke-width="2" fill="none"/></svg>`,
            straight: `<svg viewBox="0 0 100 20"><line x1="5" y1="10" x2="95" y2="10" stroke="black" stroke-width="2"/></svg>`
        };

        // --- DOM Element References ---
        const footingsContainer = document.getElementById('footings-container');
        const calculateBtn = document.getElementById('calculateBtn');
        const addFootingBtn = document.getElementById('addFootingBtn');
        const resetBtn = document.getElementById('resetBtn');
        const downloadXlsBtn = document.getElementById('downloadXlsBtn');
        const downloadPdfBtn = document.getElementById('downloadPdfBtn');
        const totalSummaryOutput = document.getElementById('total-summary-output');
        const detailedSummaryContainer = document.getElementById('detailed-summary-container');
        const detailedBbsTbody = document.getElementById('detailed-bbs-tbody');

        // --- Footing Template ---
        function createFootingHTML(id) {
            return `
                <div class="card footing-block" data-id="${id}" onfocusin="updateActiveFootingVisuals(${id})">
                    <div class="flex justify-between items-center">
                        <h2 class="card-title !border-b-0">Footing Details #${id}</h2>
                        ${id > 1 ? `<button class="btn btn-danger btn-sm" onclick="removeFooting(this)">Remove</button>` : ''}
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="input-group"><label for="footingName_${id}">Footing Name</label><input type="text" id="footingName_${id}" class="input-field" value="F${id}"></div>
                        <div class="input-group"><label for="numFooting_${id}">No. of Footings</label><input type="number" id="numFooting_${id}" class="input-field" value="1"></div>
                        <div class="input-group"><label for="lengthA_${id}">Length (A) (mm)</label><input type="number" id="lengthA_${id}" class="input-field" value="1500" oninput="updateActiveFootingVisuals(${id})"></div>
                        <div class="input-group"><label for="widthB_${id}">Width (B) (mm)</label><input type="number" id="widthB_${id}" class="input-field" value="1200" oninput="updateActiveFootingVisuals(${id})"></div>
                        <div class="input-group"><label for="depthD1_${id}">Depth (d1) (mm)</label><input type="number" id="depthD1_${id}" class="input-field" value="300" oninput="updateActiveFootingVisuals(${id})"></div>
                        <div class="input-group"><label for="depthD2_${id}">Depth (d2) (mm)</label><input type="number" id="depthD2_${id}" class="input-field" value="100" oninput="updateActiveFootingVisuals(${id})"></div>
                        <div class="input-group"><label for="pedestalHeight_${id}">Pedestal Height (P) (mm)</label><input type="number" id="pedestalHeight_${id}" class="input-field" value="1000" oninput="updateActiveFootingVisuals(${id})"></div>
                        <div class="input-group"><label for="glDepth_${id}">Depth from GL (mm)</label><input type="number" id="glDepth_${id}" class="input-field" value="2000" oninput="updateActiveFootingVisuals(${id})"></div>
                        <div class="input-group"><label for="coverC_${id}">Clear Cover (c) (mm)</label><input type="number" id="coverC_${id}" class="input-field" value="50"></div>
                    </div>
                    <hr class="my-4 border-slate-200">
                    <h3 class="text-lg font-semibold mb-3 text-slate-700">Main Bar (RA)</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div class="input-group"><label for="diaRA_${id}">Dia (mm)</label><input type="number" id="diaRA_${id}" class="input-field" value="12"></div>
                        <div class="input-group"><label for="spacingRA_${id}">Spacing (mm)</label><input type="number" id="spacingRA_${id}" class="input-field" value="150"></div>
                    </div>
                    <div class="input-group">
                        <label>Shape of Bar</label>
                        <div class="custom-select" data-value="hooked" data-type="ra" data-id="${id}">
                            <div class="selected-option">${SVG_SHAPES.hooked}<span class="arrow ml-auto">▼</span></div>
                            <div class="options-list hidden">
                                <div class="option" data-value="inverted_hooked">${SVG_SHAPES.inverted_hooked}</div>
                                <div class="option" data-value="hooked">${SVG_SHAPES.hooked}</div>
                                <div class="option" data-value="straight">${SVG_SHAPES.straight}</div>
                            </div>
                        </div>
                    </div>
                    <div id="bends-section-ra_${id}">
                        <div id="bends-container-ra_${id}"><label class="font-medium text-slate-700">Bend Details for RA</label></div>
                        <button onclick="addBend('ra', ${id})" class="btn btn-secondary mt-2 text-sm">+ Add Bend</button>
                    </div>
                    <hr class="my-4 border-slate-200">
                    <h3 class="text-lg font-semibold mb-3 text-slate-700">Distribution Bar (RB)</h3>
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div class="input-group"><label for="diaRB_${id}">Dia (mm)</label><input type="number" id="diaRB_${id}" class="input-field" value="10"></div>
                        <div class="input-group"><label for="spacingRB_${id}">Spacing (mm)</label><input type="number" id="spacingRB_${id}" class="input-field" value="150"></div>
                    </div>
                     <div class="input-group">
                        <label>Shape of Bar</label>
                        <div class="custom-select" data-value="hooked" data-type="rb" data-id="${id}">
                            <div class="selected-option">${SVG_SHAPES.hooked}<span class="arrow ml-auto">▼</span></div>
                            <div class="options-list hidden">
                                <div class="option" data-value="inverted_hooked">${SVG_SHAPES.inverted_hooked}</div>
                                <div class="option" data-value="hooked">${SVG_SHAPES.hooked}</div>
                                <div class="option" data-value="straight">${SVG_SHAPES.straight}</div>
                            </div>
                        </div>
                    </div>
                    <div id="bends-section-rb_${id}">
                        <div id="bends-container-rb_${id}"><label class="font-medium text-slate-700">Bend Details for RB</label></div>
                        <button onclick="addBend('rb', ${id})" class="btn btn-secondary mt-2 text-sm">+ Add Bend</button>
                    </div>
                </div>
            `;
        }

        function addFooting() {
            footingCounter++;
            const footingHTML = createFootingHTML(footingCounter);
            footingsContainer.insertAdjacentHTML('beforeend', footingHTML);
            addBend('ra', footingCounter);
            addBend('rb', footingCounter);
            updateActiveFootingVisuals(footingCounter);
        }

        function removeFooting(button) {
            button.closest('.footing-block').remove();
            const firstFooting = document.querySelector('.footing-block');
            if (firstFooting) {
                updateActiveFootingVisuals(firstFooting.dataset.id);
            }
        }

        // --- Update Image Labels ---
        function updateActiveFootingVisuals(id) {
            const lengthA = document.getElementById(`lengthA_${id}`).value || 0;
            const widthB = document.getElementById(`widthB_${id}`).value || 0;
            const depthD1 = document.getElementById(`depthD1_${id}`).value || 0;
            const depthD2 = document.getElementById(`depthD2_${id}`)?.value || 0;
            const pedestalHeight = document.getElementById(`pedestalHeight_${id}`)?.value || 0;
            const glDepth = document.getElementById(`glDepth_${id}`)?.value || 0;

            document.getElementById('plan-label-a').textContent = lengthA;
            document.getElementById('plan-label-b').textContent = widthB;
            document.getElementById('section-label-gl').textContent = glDepth;
            document.getElementById('section-label-p').textContent = pedestalHeight;
            document.getElementById('section-label-d2').textContent = depthD2;
            document.getElementById('section-label-d1').textContent = depthD1;
        }

        // --- Bend Management ---
        function createBendRow(type, footingId, index) {
            const container = document.createElement('div');
            container.className = 'bend-row grid grid-cols-1 md:grid-cols-4 gap-3 items-end mt-2';
            container.innerHTML = `
                <div class="input-group !mb-0">
                    ${index === 0 ? '<label class="text-sm">No. of Bends</label>' : ''}
                    <select class="input-field bend-num text-sm">
                        <option value="1">1</option><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option>
                    </select>
                </div>
                <div class="input-group !mb-0">
                    ${index === 0 ? '<label class="text-sm">Degree</label>' : ''}
                    <select class="input-field bend-degree text-sm">
                        <option value="1">45° (1D)</option><option value="2" selected>90° (2D)</option><option value="3">135° (3D)</option><option value="4">180° (4D)</option>
                    </select>
                </div>
                <div class="input-group !mb-0">
                    ${index === 0 ? '<label class="text-sm">Deduction</label>' : ''}
                    <input type="text" class="input-field bg-slate-100 bend-value text-sm" readonly>
                </div>
                <div>${index > 0 ? `<button class="btn btn-danger btn-sm !py-2 w-full" onclick="this.closest('.bend-row').remove()">Remove</button>` : '<div class="h-[37px]"></div>'}</div>`;
            return container;
        }

        function addBend(type, footingId) {
            const container = document.getElementById(`bends-container-${type}_${footingId}`);
            const index = container.querySelectorAll('.bend-row').length;
            const newBendRow = createBendRow(type, footingId, index);
            container.appendChild(newBendRow);
            
            newBendRow.querySelectorAll('.bend-num, .bend-degree').forEach(select => {
                select.addEventListener('change', () => updateBendDeduction(newBendRow));
            });
            
            updateBendDeduction(newBendRow);
        }

        function updateBendDeduction(row) {
            const footingBlock = row.closest('.footing-block');
            const footingId = footingBlock.dataset.id;
            const bendsContainer = row.closest('[id^="bends-container-"]');
            const type = bendsContainer.id.includes('ra') ? 'ra' : 'rb';

            const diaInput = document.getElementById(`dia${type.toUpperCase()}_${footingId}`);
            const dia = parseFloat(diaInput.value) || 0;
            
            const numBends = parseFloat(row.querySelector('.bend-num').value) || 0;
            const degreeFactor = parseFloat(row.querySelector('.bend-degree').value) || 0;
            
            const deduction = dia * numBends * degreeFactor;
            row.querySelector('.bend-value').value = deduction.toFixed(2);
        }

        // --- Main Calculation Logic ---
        function calculateAllFootings() {
            allFootingResults = [];
            const footingBlocks = document.querySelectorAll('.footing-block');
            
            footingBlocks.forEach(block => {
                const id = block.dataset.id;
                const shapeRA = block.querySelector(`.custom-select[data-type="ra"]`).dataset.value;
                const shapeRB = block.querySelector(`.custom-select[data-type="rb"]`).dataset.value;

                const inputs = {
                    footingName: document.getElementById(`footingName_${id}`).value || `F${id}`,
                    numFooting: parseFloat(document.getElementById(`numFooting_${id}`).value) || 0,
                    lengthA: parseFloat(document.getElementById(`lengthA_${id}`).value) || 0,
                    widthB: parseFloat(document.getElementById(`widthB_${id}`).value) || 0,
                    depthD1: parseFloat(document.getElementById(`depthD1_${id}`).value) || 0,
                    coverC: parseFloat(document.getElementById(`coverC_${id}`).value) || 0,
                    diaRA: parseFloat(document.getElementById(`diaRA_${id}`).value) || 0,
                    spacingRA: parseFloat(document.getElementById(`spacingRA_${id}`).value) || 0,
                    diaRB: parseFloat(document.getElementById(`diaRB_${id}`).value) || 0,
                    spacingRB: parseFloat(document.getElementById(`spacingRB_${id}`).value) || 0,
                    shapeRA: shapeRA,
                    shapeRB: shapeRB
                };

                let totalBendDeductionRA = 0;
                if (shapeRA !== 'straight') {
                    document.querySelectorAll(`#bends-container-ra_${id} .bend-row`).forEach(row => {
                        totalBendDeductionRA += parseFloat(row.querySelector('.bend-value').value) || 0;
                    });
                }

                let totalBendDeductionRB = 0;
                if (shapeRB !== 'straight') {
                    document.querySelectorAll(`#bends-container-rb_${id} .bend-row`).forEach(row => {
                        totalBendDeductionRB += parseFloat(row.querySelector('.bend-value').value) || 0;
                    });
                }
                
                const hasHooksRA = shapeRA !== 'straight';
                const hasHooksRB = shapeRB !== 'straight';

                const hookLength = (inputs.depthD1 - 2 * inputs.coverC);
                const mainBarLength = (inputs.lengthA - 2 * inputs.coverC);
                const cuttingLengthRA = mainBarLength + (hasHooksRA ? (2 * hookLength) : 0) - totalBendDeductionRA;
                const numBarsRA = Math.floor((inputs.widthB - 2 * inputs.coverC) / inputs.spacingRA) + 1;
                const totalLengthRA = cuttingLengthRA * numBarsRA * inputs.numFooting;
                const totalWeightRA = (Math.pow(inputs.diaRA, 2) / 162) * (totalLengthRA / 1000);

                const distBarLength = (inputs.widthB - 2 * inputs.coverC);
                const cuttingLengthRB = distBarLength + (hasHooksRB ? (2 * hookLength) : 0) - totalBendDeductionRB;
                const numBarsRB = Math.floor((inputs.lengthA - 2 * inputs.coverC) / inputs.spacingRB) + 1;
                const totalLengthRB = cuttingLengthRB * numBarsRB * inputs.numFooting;
                const totalWeightRB = (Math.pow(inputs.diaRB, 2) / 162) * (totalLengthRB / 1000);
                
                const grandTotalWeight = totalWeightRA + totalWeightRB;

                allFootingResults.push({
                    id: id,
                    inputs: inputs,
                    ra: { dia: inputs.diaRA, cuttingLength: cuttingLengthRA, numBars: numBarsRA, totalLength: totalLengthRA, totalWeight: totalWeightRA, barLength: mainBarLength, hookLength: hookLength },
                    rb: { dia: inputs.diaRB, cuttingLength: cuttingLengthRB, numBars: numBarsRB, totalLength: totalLengthRB, totalWeight: totalWeightRB, barLength: distBarLength, hookLength: hookLength },
                    grandTotalWeight: grandTotalWeight
                });
            });
            
            displayDetailedSummary(allFootingResults);
            displayTotalSummary(allFootingResults);
        }
        
        function displayTotalSummary(results) {
            let totalWeight = 0;
            results.forEach(res => totalWeight += res.grandTotalWeight);
            totalSummaryOutput.innerHTML = `
                <p class="text-lg font-semibold text-slate-700">Total Steel for All Footings:</p>
                <p class="text-3xl font-bold text-indigo-600">${totalWeight.toFixed(3)} kg</p>
            `;
            downloadXlsBtn.disabled = false;
            downloadPdfBtn.disabled = false;
        }

        function getWeightDistribution(dia, weight) {
            const diameters = [8, 10, 12, 16];
            let distribution = ['-', '-', '-', '-'];
            const index = diameters.indexOf(dia);
            if (index !== -1) {
                distribution[index] = weight.toFixed(2);
            }
            return distribution;
        }

        function createBarShapeSVG(barLength, hookLength, shape) {
            const barLengthStr = barLength.toFixed(0);
            const hookLengthStr = hookLength.toFixed(0);
            const textStyle = `font-family: 'Inter', sans-serif; font-size: 10px; fill: #000000; text-anchor: middle; font-weight: bold;`;

            switch (shape) {
                case 'straight':
                    return `<svg viewBox="0 0 150 50" width="150" height="50" xmlns="http://www.w3.org/2000/svg">
                                <line x1="10" y1="25" x2="140" y2="25" stroke="#2d3748" stroke-width="2"/>
                                <text x="75" y="40" style="${textStyle}">${barLengthStr}</text>
                            </svg>`;
                case 'inverted_hooked': // U-shape, hooks up
                    return `<svg viewBox="0 0 150 50" width="150" height="50" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 40 V 15 H 130 V 40" stroke="#2d3748" stroke-width="2" fill="none"/>
                                <text x="75" y="10" style="${textStyle}">${barLengthStr}</text>
                                <text x="10" y="27.5" style="${textStyle}">${hookLengthStr}</text>
                                <text x="140" y="27.5" style="${textStyle}">${hookLengthStr}</text>
                            </svg>`;
                case 'hooked': // n-shape, hooks down
                default:
                    return `<svg viewBox="0 0 150 50" width="150" height="50" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 10 V 35 H 130 V 10" stroke="#2d3748" stroke-width="2" fill="none"/>
                                <text x="75" y="48" style="${textStyle}">${barLengthStr}</text>
                                <text x="10" y="22.5" style="${textStyle}">${hookLengthStr}</text>
                                <text x="140" y="22.5" style="${textStyle}">${hookLengthStr}</text>
                            </svg>`;
            }
        }

        function displayDetailedSummary(results) {
            detailedBbsTbody.innerHTML = ''; 
            
            let total_8 = 0, total_10 = 0, total_12 = 0, total_16 = 0;

            results.forEach((data, index) => {
                const headerRow = detailedBbsTbody.insertRow();
                headerRow.innerHTML = `<td class="font-bold">${index + 1}</td><td class="font-bold text-left" colspan="13">Footing ${data.inputs.footingName}</td>`;

                const ra_dist = getWeightDistribution(data.ra.dia, data.ra.totalWeight);
                const rb_dist = getWeightDistribution(data.rb.dia, data.rb.totalWeight);

                const rowsData = [
                    { desc: 'RA', shape: createBarShapeSVG(data.ra.barLength, data.ra.hookLength, data.inputs.shapeRA), items: data.inputs.numFooting, dia: data.ra.dia, num_bars: data.ra.numBars, cut_len: (data.ra.cuttingLength / 1000).toFixed(3), total_len: (data.ra.totalLength / 1000).toFixed(3), unit_wt: (Math.pow(data.ra.dia, 2) / 162).toFixed(3), total_wt: data.ra.totalWeight.toFixed(3), dist: ra_dist },
                    { desc: 'RB', shape: createBarShapeSVG(data.rb.barLength, data.rb.hookLength, data.inputs.shapeRB), items: data.inputs.numFooting, dia: data.rb.dia, num_bars: data.rb.numBars, cut_len: (data.rb.cuttingLength / 1000).toFixed(3), total_len: (data.rb.totalLength / 1000).toFixed(3), unit_wt: (Math.pow(data.rb.dia, 2) / 162).toFixed(3), total_wt: data.rb.totalWeight.toFixed(3), dist: rb_dist }
                ];

                rowsData.forEach(r => {
                    const row = detailedBbsTbody.insertRow();
                    row.innerHTML = `
                        <td></td><td>${r.desc}</td><td>${r.shape}</td><td>${r.items}</td><td>${r.dia}</td>
                        <td>${r.num_bars}</td><td>${r.cut_len}</td><td>${r.total_len}</td><td>${r.unit_wt}</td>
                        <td>${r.total_wt}</td><td>${r.dist[0]}</td><td>${r.dist[1]}</td><td>${r.dist[2]}</td><td>${r.dist[3]}</td>
                    `;
                });

                total_8 += (parseFloat(ra_dist[0]) || 0) + (parseFloat(rb_dist[0]) || 0);
                total_10 += (parseFloat(ra_dist[1]) || 0) + (parseFloat(rb_dist[1]) || 0);
                total_12 += (parseFloat(ra_dist[2]) || 0) + (parseFloat(rb_dist[2]) || 0);
                total_16 += (parseFloat(ra_dist[3]) || 0) + (parseFloat(rb_dist[3]) || 0);
            });

            const totalRow = detailedBbsTbody.insertRow();
            totalRow.innerHTML = `
                <td colspan="10" class="text-right font-bold">Grand Total Weight (kg)</td>
                <td class="font-bold">${total_8 > 0 ? total_8.toFixed(2) : '-'}</td>
                <td class="font-bold">${total_10 > 0 ? total_10.toFixed(2) : '-'}</td>
                <td class="font-bold">${total_12 > 0 ? total_12.toFixed(2) : '-'}</td>
                <td class="font-bold">${total_16 > 0 ? total_16.toFixed(2) : '-'}</td>
            `;

            detailedSummaryContainer.classList.remove('hidden');
        }

        // --- CSV Download (FIXED) ---
        function downloadCSV() {
            if (allFootingResults.length === 0) return;
            
            const shapeNames = {
                hooked: "Hooked Bar (Down)",
                inverted_hooked: "Inverted Hooked Bar (Up)",
                straight: "Straight Bar"
            };

            let csvRows = [
                "S.No.,Description,Shape of Bar,No. of Items,Dia of bar (mm),No. of bars,Cutting Length (m),Total Length (m),Unit Wt (kg/m),Total Wt. (kg),8mm (kg),10mm (kg),12mm (kg),16mm (kg)"
            ];
            
            let total_8 = 0, total_10 = 0, total_12 = 0, total_16 = 0;

            allFootingResults.forEach((data, index) => {
                csvRows.push(`${index + 1},"Footing ${data.inputs.footingName}",,,,,,,,,,,,`);
                const ra_dist = getWeightDistribution(data.ra.dia, data.ra.totalWeight);
                const rb_dist = getWeightDistribution(data.rb.dia, data.rb.totalWeight);
                
                total_8 += (parseFloat(ra_dist[0]) || 0) + (parseFloat(rb_dist[0]) || 0);
                total_10 += (parseFloat(ra_dist[1]) || 0) + (parseFloat(rb_dist[1]) || 0);
                total_12 += (parseFloat(ra_dist[2]) || 0) + (parseFloat(rb_dist[2]) || 0);
                total_16 += (parseFloat(ra_dist[3]) || 0) + (parseFloat(rb_dist[3]) || 0);

                const shapeRAName = shapeNames[data.inputs.shapeRA] || data.inputs.shapeRA;
                const shapeRBName = shapeNames[data.inputs.shapeRB] || data.inputs.shapeRB;

                const rowRA = [ '', 'RA', `"${shapeRAName}"`, data.inputs.numFooting, data.ra.dia, data.ra.numBars, (data.ra.cuttingLength / 1000).toFixed(3), (data.ra.totalLength / 1000).toFixed(3), (Math.pow(data.ra.dia, 2) / 162).toFixed(3), data.ra.totalWeight.toFixed(3), ra_dist[0], ra_dist[1], ra_dist[2], ra_dist[3] ];
                const rowRB = [ '', 'RB', `"${shapeRBName}"`, data.inputs.numFooting, data.rb.dia, data.rb.numBars, (data.rb.cuttingLength / 1000).toFixed(3), (data.rb.totalLength / 1000).toFixed(3), (Math.pow(data.rb.dia, 2) / 162).toFixed(3), data.rb.totalWeight.toFixed(3), rb_dist[0], rb_dist[1], rb_dist[2], rb_dist[3] ];
                
                csvRows.push(rowRA.join(','));
                csvRows.push(rowRB.join(','));
            });

            const totalRow = [ '', '', '', '', '', '', '', '', '', '"Grand Total"', (total_8 > 0 ? total_8.toFixed(2) : '-'), (total_10 > 0 ? total_10.toFixed(2) : '-'), (total_12 > 0 ? total_12.toFixed(2) : '-'), (total_16 > 0 ? total_16.toFixed(2) : '-') ];
            csvRows.push(totalRow.join(','));

            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            link.setAttribute("href", URL.createObjectURL(blob));
            link.setAttribute("download", "bbs-footing-schedule.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // --- PDF Generation Helpers (NEW) ---
        function svgToDataURL(svgString) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
                const url = URL.createObjectURL(svgBlob);
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    URL.revokeObjectURL(url);
                    resolve(canvas.toDataURL('image/png'));
                };
                img.onerror = (e) => {
                    URL.revokeObjectURL(url);
                    reject(new Error("Failed to load SVG image for PDF generation.", e));
                };
                img.src = url;
            });
        }
        
        async function generatePdfImages(results) {
            const imageMap = {};
            const promises = [];
            results.forEach(data => {
                const raKey = `${data.inputs.footingName}-RA`;
                const rbKey = `${data.inputs.footingName}-RB`;

                const raSvg = createBarShapeSVG(data.ra.barLength, data.ra.hookLength, data.inputs.shapeRA);
                const rbSvg = createBarShapeSVG(data.rb.barLength, data.rb.hookLength, data.inputs.shapeRB);
                
                promises.push(svgToDataURL(raSvg).then(url => imageMap[raKey] = url));
                promises.push(svgToDataURL(rbSvg).then(url => imageMap[rbKey] = url));
            });
            await Promise.all(promises);
            return imageMap;
        }

        // --- PDF Download (FIXED) ---
        async function downloadPDF() {
            if (allFootingResults.length === 0) return;

            // Generate specific images for each bar with correct labels
            const shapeImages = await generatePdfImages(allFootingResults);

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({orientation: 'landscape'});

            doc.setFontSize(18);
            doc.text("Detailed Bar Bending Schedule for Footing", 14, 22);
            
            const tableBody = [];
            let total_8 = 0, total_10 = 0, total_12 = 0, total_16 = 0;
            
            allFootingResults.forEach((data, index) => {
                tableBody.push([{ content: `${index + 1}`, styles: { fontStyle: 'bold' } }, { content: `Footing ${data.inputs.footingName}`, colSpan: 13, styles: { fontStyle: 'bold', halign: 'left' } }]);
                const ra_dist = getWeightDistribution(data.ra.dia, data.ra.totalWeight);
                const rb_dist = getWeightDistribution(data.rb.dia, data.rb.totalWeight);
                
                total_8 += (parseFloat(ra_dist[0]) || 0) + (parseFloat(rb_dist[0]) || 0);
                total_10 += (parseFloat(ra_dist[1]) || 0) + (parseFloat(rb_dist[1]) || 0);
                total_12 += (parseFloat(ra_dist[2]) || 0) + (parseFloat(rb_dist[2]) || 0);
                total_16 += (parseFloat(ra_dist[3]) || 0) + (parseFloat(rb_dist[3]) || 0);
                
                // Pass the unique key for the image to be drawn in didDrawCell
                const raKey = `${data.inputs.footingName}-RA`;
                const rbKey = `${data.inputs.footingName}-RB`;

                tableBody.push(['', 'RA', raKey, data.inputs.numFooting, data.ra.dia, data.ra.numBars, (data.ra.cuttingLength / 1000).toFixed(3), (data.ra.totalLength / 1000).toFixed(3), (Math.pow(data.ra.dia, 2) / 162).toFixed(3), data.ra.totalWeight.toFixed(3), ra_dist[0], ra_dist[1], ra_dist[2], ra_dist[3]]);
                tableBody.push(['', 'RB', rbKey, data.inputs.numFooting, data.rb.dia, data.rb.numBars, (data.rb.cuttingLength / 1000).toFixed(3), (data.rb.totalLength / 1000).toFixed(3), (Math.pow(data.rb.dia, 2) / 162).toFixed(3), data.rb.totalWeight.toFixed(3), rb_dist[0], rb_dist[1], rb_dist[2], rb_dist[3]]);
            });

            // Add total row at the end
             tableBody.push([
                { content: 'Grand Total Weight (kg)', colSpan: 10, styles: { fontStyle: 'bold', halign: 'right' } },
                { content: total_8 > 0 ? total_8.toFixed(2) : '-', styles: { fontStyle: 'bold' } },
                { content: total_10 > 0 ? total_10.toFixed(2) : '-', styles: { fontStyle: 'bold' } },
                { content: total_12 > 0 ? total_12.toFixed(2) : '-', styles: { fontStyle: 'bold' } },
                { content: total_16 > 0 ? total_16.toFixed(2) : '-', styles: { fontStyle: 'bold' } }
            ]);

            doc.autoTable({
                startY: 30,
                head: [['S.No.', 'Description', 'Shape', 'Items', 'Dia', 'Bars', 'Cut (m)', 'Total (m)', 'Unit Wt', 'Total Wt', '8mm', '10mm', '12mm', '16mm']],
                body: tableBody,
                theme: 'grid',
                styles: { fontSize: 8, cellPadding: 1, valign: 'middle', halign: 'center' },
                headStyles: {fillColor: [45, 55, 72], fontSize: 8, halign: 'center'},
                columnStyles: {
                    2: { cellWidth: 40, halign: 'center' } // Shape column width
                },
                didDrawCell: function(data) {
                    if (data.column.index === 2 && data.row.section === 'body') {
                        const imageKey = data.cell.raw;
                        if (shapeImages[imageKey]) {
                            const imgData = shapeImages[imageKey];
                            const imgProps = doc.getImageProperties(imgData);
                            const cellHeight = data.cell.height - 2; // padding
                            const imgHeight = cellHeight;
                            const imgWidth = (imgProps.width * imgHeight) / imgProps.height;
                            const x = data.cell.x + (data.cell.width - imgWidth) / 2;
                            const y = data.cell.y + 1; // padding
                            doc.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
                        }
                    }
                }
            });

            doc.save('bbs-footing-schedule-detailed.pdf');
        }

        // --- Reset Function ---
        function resetAll() {
            footingsContainer.innerHTML = '';
            footingCounter = 0;
            addFooting(); 
            totalSummaryOutput.innerHTML = '<p class="text-slate-500">Calculate to see the total weight.</p>';
            detailedSummaryContainer.classList.add('hidden');
            detailedBbsTbody.innerHTML = '';
            allFootingResults = [];
            downloadXlsBtn.disabled = true;
            downloadPdfBtn.disabled = true;
        }

        // --- Event Delegation for Custom Selects and Dia Inputs ---
        footingsContainer.addEventListener('click', function(e) {
            const selectedOption = e.target.closest('.selected-option');
            if (selectedOption) {
                const optionsList = selectedOption.nextElementSibling;
                optionsList.classList.toggle('hidden');
                selectedOption.querySelector('.arrow').style.transform = optionsList.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
            }

            const option = e.target.closest('.option');
            if (option) {
                const customSelect = option.closest('.custom-select');
                const selected = customSelect.querySelector('.selected-option');
                
                customSelect.dataset.value = option.dataset.value;
                selected.innerHTML = option.innerHTML + '<span class="arrow ml-auto">▼</span>';
                
                customSelect.querySelector('.options-list').classList.add('hidden');
                selected.querySelector('.arrow').style.transform = 'rotate(0deg)';

                const type = customSelect.dataset.type;
                const id = customSelect.dataset.id;
                const bendsSection = document.getElementById(`bends-section-${type}_${id}`);
                if (option.dataset.value === 'straight') {
                    bendsSection.style.display = 'none';
                } else {
                    bendsSection.style.display = 'block';
                }
            }
        });

        footingsContainer.addEventListener('input', function(e) {
            if (e.target.matches('[id^="diaRA_"]') || e.target.matches('[id^="diaRB_"]')) {
                const footingBlock = e.target.closest('.footing-block');
                const type = e.target.id.includes('RA') ? 'ra' : 'rb';
                footingBlock.querySelectorAll(`#bends-container-${type}_${footingBlock.dataset.id} .bend-row`).forEach(row => {
                    updateBendDeduction(row);
                });
            }
        });

        // --- Event Listeners ---
        calculateBtn.addEventListener('click', calculateAllFootings);
        addFootingBtn.addEventListener('click', addFooting);
        resetBtn.addEventListener('click', resetAll);
        downloadXlsBtn.addEventListener('click', downloadCSV);
        downloadPdfBtn.addEventListener('click', downloadPDF);
        
        // --- Initial Setup ---
        window.onload = () => {
            addFooting();
        };