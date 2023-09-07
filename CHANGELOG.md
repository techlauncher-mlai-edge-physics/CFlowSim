<a name="unreleased"></a>
## [Unreleased]


<a name="Unreleased"></a>
## Unreleased - 2023-09-07
### Ci
- **actions:** create github action files ([#24](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/24))
- **changelog:** fix the permission error ([#25](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/25))
- **commit:** add pre-commit hook for the project ([#18](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/18))
- **deps:** add dependabot, bump dependencies ([#46](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/46))

### Docs
- **ISSUE_TEMPLATE:** add issue templates ([#26](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/26))
- **LICENSE:** create LICENSE ([#34](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/34))
- **README:** replace LICENSE placeholder ([#60](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/60))
- **readme:** change header to CFlowSim ([#43](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/43))
- **readme:** changed title to github pages
- **readme:** update readme.md
- **readme:** init readme file

### Feat
- **AboutPage:** initialize the about page with changing the navbar
- **ParametersBar:** add options to change colors ([#17](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/17))
- **ParmetersBar:** initialize parameters bar with standard components
- **README:** add badges
- **Simulation:** completed the data interchange between the shader and the model
- **Simulator:** implement force interaction with model ([#13](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/13))
- **Simulator:** add proper rendering of model output
- **Simulator:** readd basic hardware accelerated rendering of float arrays Co-authored-by: Chenzhu <u7171958[@anu](https://github.com/anu).edu.au>
- **Simulator:** readd basic hardware accelerated rendering of float arrays
- **Simulator:** added base code for rendering model output.
- **Simulator:** added base code for rendering model output.
- **about:** add content for about page ([#12](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/12))
- **about:** changed styling and content of about page and refactored docs
- **app:** create the template for further development
- **index:** add ControlBar for simulation ([#21](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/21))
- **index:** add simulator integration ([#14](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/14))
- **modelService:** add fps limitation when model running
- **modelService:** add fps limitation when model running ([#9](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/9))
- **modelWorker:** add modelWorker to resolve foreground blocking ([#4](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/4))
- **modelWorker:** change the output to density
- **parameter-pane:** create components for parameter pane ([#52](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/52))
- **project:** re-init the project to use Nextjs, add contribution guide and related deps ([#2](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/2))
- **simulator:** convert rendering to texture ([#19](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/19))
- **simulator:** add basic renderer and physics engine support
- **simulator:** add parameters setting ([#7](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/7))
- **simulator:** render a colored plane with threejs
- **theme:** add initial code for website themes ([#16](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/16))
- **website:** implement the responsive design ([#45](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/45))
- **website:** add Navbar to the website;

### Fix
- **NavBar:** change the position of the logo
- **Simulator:** hotfix for previous commit
- **Simulator:** remove bands on renderer ([#15](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/15))
- **Simulator:** remove bands on renderer
- **about:** add types declaration, replace <a> with <Link>
- **component:** use a uniform style for components
- **git:** fix merge conflicts for simulator team
- **modelService:** fix not restoring the simulation after hit fps limit
- **modelService:** fix a error blocks model running
- **modelWorker:** fix a bug that may prevent message passing
- **package.json:** fix issue prevent dynamic reloading before
- **project:** add/update return type for react funtions
- **styles:** remove the margin for body element
- **styles:** declare css module

### Refactor
- **NavBar:** refactor the header style & add new button styles
- **NavBar:** refactor the theme_btn style
- **NavBar:** change the alt text for the logo
- **PhysicsCore:** refactor PhysicsCore to modelService with TS ([#3](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/3))
- **app:** use vite + reactjs instead of nextjs ([#23](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/23))
- **components:** relocate the components from the pages folder to the root folder
- **index:** remove the unused imports and variables
- **modelService:** refactor the normalization function ([#8](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/8))
- **project:** add type delcaretion for functions
- **styles:** remove deprecated style sheets ([#53](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/53))

### Style
- change occurences of Physics in the browser to CFlowSim ([#20](https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/issues/20))
- format the code with prettier
- **main:** formatting to solve the eslint conflict
- **project:**  format the code with prettier

### BREAKING CHANGE

Previously used data.type has been renamed to data.func
to share with updateForce

* Data normalization in modelService;
Replace data with unnormalized data;

* feat(modelVerify): add Head for modelVerify

* fix(modelWorker): fix size issue after compression

---------

The output dir is now /out instead of /build; The dev folder is now under root folder


[Unreleased]: https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser/compare/Unreleased...HEAD
