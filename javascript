document.getElementById('carbonForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const electricity = parseFloat(document.getElementById('electricity').value);
  const travel = parseFloat(document.getElementById('travel').value);
  const diet = document.getElementById('diet').value;

  const factors = {
    electricity: 0.92,
    travel: 0.21,
    diet: {
      veg: 1.5,
      mixed: 2.5,
      nonveg: 3.5
    }
  };

  const electricityCO2 = electricity * 12 * factors.electricity;
  const travelCO2 = travel * 12 * factors.travel;
  const dietCO2 = 365 * factors.diet[diet];
  const totalCO2 = electricityCO2 + travelCO2 + dietCO2;

  document.getElementById('total').textContent =
    totalCO2.toFixed(2) + " kg CO₂/year";

  // Show reduction tips
  const tips = [];
  if (electricity > 200)
    tips.push("💡 Use energy-efficient LED lighting.");
  if (travel > 500)
    tips.push("🚗 Try public transport or carpooling.");
  if (diet === "nonveg")
    tips.push("🥗 Reducing meat can significantly cut emissions.");

  document.getElementById('tips').innerHTML =
    tips.map(tip => `<p>${tip}</p>`).join('');

  document.getElementById('results').classList.remove('hidden');

  // Draw pie chart
  drawChart([
    { name: "Electricity", value: electricityCO2 },
    { name: "Travel", value: travelCO2 },
    { name: "Diet", value: dietCO2 }
  ]);
});

function drawChart(data) {
  d3.select("#chart").html("");

  const width = 300,
        height = 300,
        radius = Math.min(width, height) / 2;

  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const pie = d3.pie().value(d => d.value);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const arcs = svg.selectAll("arc")
    .data(pie(data))
    .enter()
    .append("g");

  arcs.append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => color(i));

  arcs.append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text(d => d.data.name);
}
