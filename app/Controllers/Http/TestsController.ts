import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TestsController {
    // public async index ( {}: HttpContextContract ) {
    //     return 'Test'
    // }

    public async create ( {}: HttpContextContract ) {
        return 'Test 2'
    }

    public async store ( {}: HttpContextContract ) {
        return 'Test 3'
    }

    public async show ( {}: HttpContextContract ) {
        return 'Test 4'
    }

    public async edit ( {}: HttpContextContract ) {
        return 'Test 5'
    }

    public async update ( {}: HttpContextContract ) {
        return 'Test 6'
    }

    public async destroy ( {}: HttpContextContract ) {
        return 'Test 7'
    }
}
