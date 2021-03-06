var program = require('commander');
var Random = require("random-js");
var fs = require("fs");

program
  .version('0.2')
  .option('-s, --seed [value]', 'Set random seed [0]', 0)
  .option('-d, --duration [value]', 'Set trace duration in minutes [30]', 30)
  .option('-a, --amount [value]', 'Amount of workflows [50]', 50)
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
		"nodes": "A:CC:M, B:CC:M, C:CC:L, D:CI:M, E:CC:M, F:CI:L, G:CC:M, H:CN:M, I:CC:M",
        "edges": "A:CC:M -> B:CC:M, A:CC:M -> C:CC:L, A:CC:M -> D:CI:M, A:CC:M -> E:CC:M, A:CC:M -> F:CI:L, A:CC:M -> G:CC:M, A:CC:M -> H:CN:M, A:CC:M -> I:CC:M",
        "type": 1
	},
    {
		"nodes": "A:CI:M, B:CC:M, C:CI:M, D:CI:M, E:CN:M, F:CI:M, G:CN:M, H:CC:S",
		"edges": "A:CI:M -> B:CC:M, A:CI:M -> C:CI:M, A:CI:M -> D:CI:M, B:CC:M -> E:CN:M, C:CI:M -> F:CI:M, D:CI:M -> G:CN:M, E:CN:M -> H:CC:S, F:CI:M -> H:CC:S, G:CN:M -> H:CC:S",
        "type": 2
	},
	{
		"nodes": "A:CI:M, B:CC:M, C:CI:M, D:HE:15, E:CN:M, F:CI:M, G:HH:60",
		"edges": "A:CI:M -> B:CC:M, A:CI:M -> C:CI:M, B:CC:M -> D:HE:15, C:CI:M -> D:HE:15, D:HE:15 -> E:CN:M, D:HE:15 -> F:CI:M, E:CN:M -> G:HH:60, F:CI:M -> G:HH:60",
        "type": 3
	}
];

var workflows = [];
var durationInMS = program.duration*60*1000;
var avgInterval = durationInMS / program.amount;
var r = new Random(Random.engines.mt19937().seed(program.seed));

for (var i = 0; i < program.amount; i++) {
    var flow = JSON.parse(JSON.stringify(r.pick(sampleFlows))); // Deep clone
    flow.owner = sampleOwner;
    flow.delay = 0;
    if (i > 0) {
        // Using poisson arrival times now
        flow.delay = parseInt(-Math.log(r.real(0,1)) * avgInterval) + workflows[i-1].delay;
    }

    flow.name = "Workflow with " + flow.nodes.split(',').length + " nodes starting at " + flow.delay;
    workflows.push(flow);
}

fs.writeFile(program.output, JSON.stringify(workflows, null, 2), function(){
    console.log("Done!");
});