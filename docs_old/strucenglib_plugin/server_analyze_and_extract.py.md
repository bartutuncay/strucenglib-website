```py
# This is auto generated code by StrucEngLib Plugin 0.0.13
# Find source at https://github.com/kfmResearch-NumericsTeam/StrucEng_Library_Plug_in
# Code generated at 2023-01-22T19:11:52.3331205+01:00
# Issued by user Andrin
# Action: Generate LinFe Code

from compas_fea.cad import rhino
from compas_fea.structure import ElasticIsotropic
from compas_fea.structure import ElementProperties as Properties
from compas_fea.structure import GeneralStep
from compas_fea.structure import GravityLoad
from compas_fea.structure import AreaLoad
from compas_fea.structure import PointLoad
from compas_fea.structure import GeneralDisplacement
from compas_fea.structure import FixedDisplacement
from compas_fea.structure import FixedDisplacementXX
from compas_fea.structure import FixedDisplacementYY
from compas_fea.structure import FixedDisplacementZZ
from compas_fea.structure import PinnedDisplacement
from compas_fea.structure import RollerDisplacementX
from compas_fea.structure import RollerDisplacementY
from compas_fea.structure import RollerDisplacementZ
from compas_fea.structure import RollerDisplacementXY
from compas_fea.structure import RollerDisplacementYZ
from compas_fea.structure import RollerDisplacementXZ
from compas_fea.structure import ShellSection
from compas_fea.structure import Structure

from strucenglib_connect import connect


# Snippets based on code of Andrew Liew (github.com/andrewliew), Benjamin Berger (github.com/Beberger)

name = 'Rahmen'
path = 'C:\Temp\\'
mdl = Structure(name=name, path=path)

# Elements
rhino.add_nodes_elements_from_layers(mdl, mesh_type='ShellElement', layers=[ 'elset_deck', 'elset_wall_right', 'elset_wall_left' ] )
mdl.elements[0].axes.update({'ex': [1, 0, 0], 'ey': [0, -1, 0], 'ez': [0, 0, -1]}) # for layer: elset_deck
mdl.elements[100].axes.update({'ex': [0, 0, 1], 'ey': [0, -1, 0], 'ez': [1, 0, 0]}) # for layer: elset_wall_right
mdl.elements[200].axes.update({'ex': [0, 0, -1], 'ey': [0, -1, 0], 'ez': [-1, 0, 0]}) # for layer: elset_wall_left

# Sets
rhino.add_sets_from_layers(mdl, layers=[ 'nset_pinned' ] )

# Materials
mdl.add(ElasticIsotropic(name='elset_deck_element_mat_elastic', E=33700, v=0.0, p=2500/10**9)) # for layer: elset_deck
mdl.add(ElasticIsotropic(name='elset_wall_right_element_mat_elastic', E=33700, v=0.0, p=2500/10**9)) # for layer: elset_wall_right
mdl.add(ElasticIsotropic(name='elset_wall_left_element_mat_elastic', E=33700, v=0.0, p=2500/10**9)) # for layer: elset_wall_left

# Sections
mdl.add(ShellSection(name='elset_deck_element_sec', t=100)) # for layer: elset_deck
mdl.add(ShellSection(name='elset_wall_right_element_sec', t=100)) # for layer: elset_wall_right
mdl.add(ShellSection(name='elset_wall_left_element_sec', t=100)) # for layer: elset_wall_left

# Properties
mdl.add(Properties(name='elset_deck_element_prop', material='elset_deck_element_mat_elastic', section='elset_deck_element_sec', elset='elset_deck'))
mdl.add(Properties(name='elset_wall_right_element_prop', material='elset_wall_right_element_mat_elastic', section='elset_wall_right_element_sec', elset='elset_wall_right'))
mdl.add(Properties(name='elset_wall_left_element_prop', material='elset_wall_left_element_mat_elastic', section='elset_wall_left_element_sec', elset='elset_wall_left'))

# Displacements
mdl.add([
PinnedDisplacement(name='nset_pinned_set_disp',  nodes='nset_pinned'),
])

# Loads
mdl.add(GravityLoad(name='load_0_gravity',  x=0.0,  y=0.0,  z=1.0, elements=[ 'elset_deck', 'elset_wall_right', 'elset_wall_left' ] ))
mdl.add(AreaLoad(name='load_1_area', elements=[ 'elset_deck' ] ,  z=0.03,   axes='local'))

# Steps
mdl.add([
GeneralStep(name='step_1',   displacements=[ 'nset_pinned_set_disp' ] ,  nlgeom=False),
GeneralStep(name='step_2',  loads=[ 'load_1_area' ] ,   nlgeom=False),
])
mdl.steps_order = [ 'step_1', 'step_2' ]  

# Summary
mdl.summary()

# Run on Sever ws://ibkpika.ethz.ch:8080
mdl = connect.analyse_and_extract('ws://ibkpika.ethz.ch:8080/api/compute', mdl, software='abaqus', fields=[ 'sf', 'sm' ] )

# Plot Step step_1

# Plot Step step_2
rhino.plot_data(mdl, step='step_2', field='sf1', cbar_size=1)
rhino.plot_data(mdl, step='step_2', field='sf2', cbar_size=1)
rhino.plot_data(mdl, step='step_2', field='sf3', cbar_size=1)
rhino.plot_data(mdl, step='step_2', field='sf4', cbar_size=1)
rhino.plot_data(mdl, step='step_2', field='sf5', cbar_size=1)
rhino.plot_data(mdl, step='step_2', field='sm1', cbar_size=1)
rhino.plot_data(mdl, step='step_2', field='sm2', cbar_size=1)
rhino.plot_data(mdl, step='step_2', field='sm3', cbar_size=1)
```
