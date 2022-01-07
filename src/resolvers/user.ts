import { User } from "src/entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";



@InputType()
class UsernamePasswordInput{
  @Field()
  username: string
  @Field()
  password: string
}
@Resolver()
export class UserReolver {
  @Mutation(() => String)
  async register(
    //first way to declare arguments
    // @Arg("username") username:String,
    // @Arg("password") password:String,

    //second way to declare arguments
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    const user = em.create(User, { username: options.username });
    await em.persistAndFlush(user)
    return user;
  }
}
