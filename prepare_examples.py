import os
import glob
import json

examples_paths = glob.glob('public/examples/*')

records = []

for example_path in examples_paths:
    example_name = os.path.basename(example_path)
    records.append ({
        'path': example_path[len("public/"):],
    })

# write to file in src
with open('src/examples.json', 'w') as f:
    f.write(json.dumps(records, indent=1))

