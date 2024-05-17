import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsModule } from './contacts/contacts.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      ssl: process.env.POSTGRES_SSL === 'true',
      extra: {
        ssl:
          process.env.POSTGRES_SSL === 'true'
            ? {
                rejectUnauthorized: false,
              }
            : null,
      },
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    ContactsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
