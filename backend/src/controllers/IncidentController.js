const connection = require('../database/connection')

module.exports = {
    async index(request, response) {
        const incidents = await connection('incidents').select('*');
        return response.json(incidents)
    },

    async indexPaginada(request, response) {
        const { page = 1 } = request.query;
        const [count] = await connection('incidents').count();

        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5)
            .offset((page - 1) * 5) // Pular de 5 em 5 pags .. Sendo assim na página 1 ele faz 1-1*5 = 5
            .select(['incidents.*',
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf']);

        //Por Boas Práticas o Total de Elementos deve ser retornado no Header
        response.header('X-Total-Count', count['count(*)'])
        return response.json(incidents)
    },

    async show(request, response) {
        const { id } = request.params
        const incident = await connection('incidents').where('id', id).first()

        if (!incident) {
            return response.status(404).json({
                error: {
                    message: 'Incident not found',
                },
            })
        }

        return response.json(incident)
    },

    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        })

        return response.json({ id })

    },

    async delete(request, response) {
        const { id } = request.params

        const ong_id = request.headers.authorization

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first()

        if (!incident) response.status(404).json({ error: 'Caso não Encontrado' })

        if (incident.ong_id !== ong_id)
            response.status(401).json({ error: 'Operação não permitida' })

        await connection('incidents').where('id', id).delete()

        return response
            .status(200)
            .send({ msg: `Caso ${id} foi deletado com Sucesso` })
    },
}