var program = require('commander');
var Random = require("random-js");
var fs = require("fs");

program
  .version('0.1')
  .option('-s, --seed [value]', 'Set random seed [0]', 0)
  .option('-d, --duration [value]', 'Set trace duration in minutes [30]', 30)
  .option('-a, --amount [value]', 'Amount of workflows [30]', 30)
  .option('-h, --human [value]', 'Percentage of human tasks in workflows [25]', 25)
  .option('-o, --output [value]', 'Filename to save trace as [output.json]', "output.json")
  .parse(process.argv);

console.log('Generating a trace with:');
console.log(' seed: ' + program.seed);
console.log(' duration of trace: ' + program.duration + " minutes");
console.log(' amount of workflows: ' + program.amount);
console.log(' ' + program.human + '% human tasks in workflows');
console.log(' saving to ' + program.output);
console.log('***');

/**
 * There are a few flows to use at the moment, as this is not a fully random generator
 * These flows are saved in sampleFlows, which is used below 
 */

var sampleOwner = "Johannes"; // Why not?

var sampleFlows = [
 	{
		"nodes": "A:CC:S, B:CN:M, C:CI:M, D:CC:L",
		"edges": "A:CC:S -> B:CN:M, A:CC:S -> C:CI:M, B:CN:M -> D:CC:L, C:CI:M -> D:CC:L"
	},
	{
		"nodes": "A:CC:S, B:CN:M, C:CI:M, D:CC:L",
		"edges": "A:CC:S -> B:CN:M, A:CC:S -> C:CI:M, B:CN:M -> D:CC:L, C:CI:M -> D:CC:L"
	}
];

var workflows = [];
var maxDelay = program.duration*60*1000;
var r = new Random(Random.engines.mt19937().seed(program.seed));
var minDelay = maxDelay+1; // Init to high value

for (var i = 0; i < program.amount; i++) {
    var flow = JSON.parse(JSON.stringify(r.pick(sampleFlows))); // Deep clone
    flow.delay = r.integer(0, maxDelay);
    flow.owner = sampleOwner;
    if (flow.delay < minDelay) minDelay = flow.delay;
    workflows.push(flow);
}

// Let it start right away
for (var i = 0; i < workflows.length; i++) {
    workflows[i].delay = workflows[i].delay - minDelay;
}

fs.writeFile(program.output, JSON.stringify(workflows, null, 2), function(){
    console.log("Done!");
});