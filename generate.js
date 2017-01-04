var program = require('commander');
var Random = require("random-js");
var fs = require("fs");

program
  .version('0.1')
  .option('-s, --seed [value]', 'Set random seed [0]', 0)
  .option('-d, --duration [value]', 'Set trace duration in minutes [40]', 40)
  .option('-a, --amount [value]', 'Amount of workflows [100]', 100)
  .option('-o, --output [value]', 'Filename to save trace as [output.json]', "output.json")
  .parse(process.argv);

console.log('Generating a trace with:');
console.log(' seed: ' + program.seed);
console.log(' duration of trace: ' + program.duration + " minutes");
console.log(' amount of workflows: ' + program.amount);
console.log(' saving to ' + program.output);
console.log('***');

/**
 * There are a few flows to use at the moment, as this is not a fully random generator
 * These flows are saved in sampleFlows, which is used below 
 */

var sampleOwner = "Johannes"; // Why not?

var sampleFlows = [
 	{
		"nodes": "A:CC:M, B:CC:M, C:CC:L, D:CI:M, E:CC:M, F:CI:L, G:HH:60, H:CN:M, I:CC:M",
        "edges": "A:CC:M -> B:CC:M, A:CC:M -> C:CC:L, A:CC:M -> D:CI:M, A:CC:M -> E:CC:M, A:CC:M -> F:CI:L, A:CC:M -> G:HH:60, A:CC:M -> H:CN:M, A:CC:M -> I:CC:M"
	},
    {
		"nodes": "A:CI:M, B:HH:60, C:CI:M, D:CI:M, E:CN:M, F:CI:M, G:HH:60, H:CC:S",
		"edges": "A:CI:M -> B:HH:60, A:CI:M -> C:CI:M, A:CI:M -> D:CI:M, B:HH:60 -> E:CN:M, C:CI:M -> F:CI:M, D:CI:M -> G:HH:60, E:CN:M -> H:CC:S, F:CI:M -> H:CC:S, G:HH:60 -> H:CC:S"
	},
	{
		"nodes": "A:CI:M, B:HH:60, C:CI:M, D:HE:15, E:CN:M, F:CI:M, G:CC:S",
		"edges": "A:CI:M -> B:HH:60, A:CI:M -> C:CI:M, B:HH:60 -> D:HE:15, C:CI:M -> D:HE:15, D:HE:15 -> E:CN:M, D:HE:15 -> F:CI:M, E:CN:M -> G:CC:S, F:CI:M -> G:CC:S"
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