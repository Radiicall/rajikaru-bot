import nextcord
from nextcord.ext import commands

class Utility(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(aliases=['av'])
    async def avatar(self, ctx, member: nextcord.Member = None):
        """Shows the pinged member's avatar Syntax: avatar (member)"""
        if(member != None):
            await ctx.reply(member.avatar)
        else:
            await ctx.reply(ctx.author.avatar)

    @commands.command(pass_context=True)
    async def nick(self, ctx, member: nextcord.Member, nick):
        await member.edit(nick=nick)
        await ctx.send(f"Changed {member}'s nickname to {member.mention}")
def setup(bot):
    bot.add_cog(Utility(bot))
