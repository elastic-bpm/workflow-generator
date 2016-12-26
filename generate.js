var program = require('commander');
var Random = require("random-js");
var fs = require("fs");

program
  .version('0.1')
  .option('-s, --seed [value]', 'Set random seed [0]', 0)
  .option('-d, --duration [value]', 'Set trace duration in minutes [30]', 30)
  .option('-a, --amount [value]', 'Amount of workflows [120]', 120)
  .option('-h, --human [value]', 'Percentage of human tasks in workflows [25]', 25) // ignored for now
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
		"nodes": "A:CC:M, B:CC:M, C:CC:L, D:CI:M, E:CC:M, F:CC:L, G:CC:M, H:CC:M, I:CC:M",
        "edges": "A:CC:M -> B:CC:M, A:CC:M -> C:CC:L, A:CC:M -> D:CI:M, A:CC:M -> E:CC:M, A:CC:M -> F:CC:L, A:CC:M -> G:CC:M, A:CC:M -> H:CC:M, A:CC:M -> I:CC:M"
	},
    {
		"nodes": "A:CC:S, B:CI:M, C:CI:M, D:CI:M, E:CN:M, F:CI:M, G:CC:M, H:CC:S",
		"edges": "A:CC:S -> B:CI:M, A:CC:S -> C:CI:M, A:CC:S -> D:CI:M, B:CI:M -> E:CN:M, C:CI:M -> F:CI:M, D:CI:M -> G:CC:M, E:CN:M -> H:CC:S, F:CI:M -> H:CC:S, G:CC:M -> H:CC:S"
	},
	{
		"nodes": "A:CC:S, B:CI:M, C:CI:M, D:CC:S, E:CN:M, F:CI:M, G:CC:S",
		"edges": "A:CC:S -> B:CI:M, A:CC:S -> C:CI:M, B:CI:M -> D:CC:S, C:CI:M -> D:CC:S, D:CC:S -> E:CN:M, D:CC:S -> F:CI:M, E:CN:M -> G:CC:S, F:CI:M -> G:CC:S"
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

// Let it start right away & set name
for (var i = 0; i < workflows.length; i++) {
    workflows[i].delay = workflows[i].delay - minDelay;
    workflows[i].name = "Workflow with " + workflows[i].nodes.split(',').length + " nodes starting at " + workflows[i].delay;
}

workflows.sort(function(a, b) {
    return a.delay - b.delay;
});

fs.writeFile(program.output, JSON.stringify(workflows, null, 2), function(){
    console.log("Done!");
});