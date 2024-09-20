import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ProjectsModule } from './modules/projects/projects.module';
import { LogsModule } from './modules/logs/logs.module';
import { FormatsModule } from './modules/formats/formats.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MetricsModule } from './modules/metrics/metrics.module';
import { BansModule } from './modules/bans/bans.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), CacheModule.register({ isGlobal: true }), MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('CONNECTION_STRING'),
      dbName: 'vmetrics'
    })
  }), UsersModule, AuthModule, ProjectsModule, LogsModule, FormatsModule, MetricsModule, BansModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
