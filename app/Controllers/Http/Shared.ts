import User from 'App/Models/User';


export default async function getCurrentUser ( userId: number ): Promise<User | null> {
    return await User.query()
                     .where( 'user_id', userId )
                     .preload( 'userGroups', ( query ) => {
                         query.preload( 'group' )
                     } )
                     .first();
}