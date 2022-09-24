import Stage from './Stage'
import Layer from './Layer'
import Uv from './Uv'

// Components
const components = [
    {name: 'Stage', component: Stage},
    {name: 'Layer', component: Layer},
    {name: 'Uv', component: Uv},
]

function InstallComponents(app, prefix = 'V') {
    components.forEach((com) => {
        app.component(`${prefix}${com.name}`, com.component);
    });
}

export {
    Stage, Layer, Uv, InstallComponents
}
