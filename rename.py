import glob
import os
# I have some dirs called _mlm.... and _slm.... and I want to rename them to mlm.... and slm....

root = "public"

for path in glob.glob(f"{root}/**/_mlm*",recursive=True):
    new_path = path.replace("_mlm_t=", "mlm_t=")
    print(f"Renaming {path} to {new_path}")
    if os.path.exists(new_path):
        print(f"Path {new_path} already exists")
    else:
        os.rename(path, new_path)

for path in glob.glob(f"{root}/**/_slm*",recursive=True):
    new_path = path.replace("_slm_t=", "slm_t=")
    print(f"Renaming {path} to {new_path}")
    if os.path.exists(new_path):
        print(f"Path {new_path} already exists")
    else:
        os.rename(path, new_path)

