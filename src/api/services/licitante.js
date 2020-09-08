module.exports = (app) => {
    const licitantes = app.data.licitantes;
    const getLicitanteById = (id) => {
        return licitantes[0];
    };

    return {getLicitanteById};
}