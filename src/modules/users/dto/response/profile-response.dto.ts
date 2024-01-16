import { Profile } from '../../type';

export class ProfileResponseDto {
  id: number;
  email: string;
  nickname: string;
  role: string;
  profileImage: string | null;
  createAt: Date;

  constructor(profile: Profile) {
    this.id = profile.id;
    this.email = profile.email;
    this.nickname = profile.nickname;
    this.role = profile.role;
    this.profileImage = profile.profileImage;
    this.createAt = profile.createAt;
  }

  static from(profile: Profile) {
    return new ProfileResponseDto(profile);
  }
}
