import Stage from './Stage'
import Projected from './Projected'
import Layer from './Layer'

// Components
const components = [
    {name: 'Stage', component: Stage},
    {name: 'Layer', component: Layer},
    {name: 'Projected', component: Projected},
]

function InstallComponents(app, prefix = 'V') {
    components.forEach((com) => {
        app.component(`${prefix}${com.name}`, com.component);
    });
}

export {
    Stage, Layer, Projected, InstallComponents
}
