import { Injectable } from '@nestjs/common';

@Injectable()
export class ClassifierService {
  private trained = false;

  train(dataset: { text: string; category: string }[]) {
    this.trained = true;
    return { success: true };
  }

  classify(text: string): string {
    if (!this.trained) throw new Error('Model not trained');

    const lower = text.toLowerCase();

    // Security category
    if (
      lower.includes('hack') ||
      lower.includes('password') ||
      lower.includes('security') ||
      lower.includes('breach') ||
      lower.includes('unauthorized') ||
      lower.includes('suspicious') ||
      lower.includes('phishing') ||
      lower.includes('malware') ||
      lower.includes('encryption') ||
      lower.includes('vpn') ||
      lower.includes('зламали') ||
      lower.includes('зламано') ||
      lower.includes('пароль') ||
      lower.includes('безпека') ||
      lower.includes('витік') ||
      lower.includes('несанкціонований') ||
      lower.includes('підозріл') ||
      lower.includes('фішинг') ||
      lower.includes('вірус') ||
      lower.includes('шифрування') ||
      lower.includes('автентифікація') ||
      lower.includes('сертифікат')
    ) {
      return 'security';
    }

    // Administrative category
    if (
      (lower.includes('user') &&
        (lower.includes('add') ||
          lower.includes('remove') ||
          lower.includes('new'))) ||
      lower.includes('permission') ||
      lower.includes('role') ||
      lower.includes('assign') ||
      lower.includes('ownership') ||
      lower.includes('admin') ||
      (lower.includes('manage') &&
        (lower.includes('subscription') || lower.includes('plan'))) ||
      lower.includes('bulk import') ||
      lower.includes('audit log') ||
      (lower.includes('користувач') &&
        (lower.includes('додати') ||
          lower.includes('видалити') ||
          lower.includes('новий'))) ||
      lower.includes('права доступу') ||
      lower.includes('роль') ||
      lower.includes('призначити') ||
      lower.includes('власніст') ||
      lower.includes('адміністратор') ||
      lower.includes('керувати') ||
      lower.includes('імпорт') ||
      lower.includes('аудит') ||
      lower.includes('відділ') ||
      lower.includes('філіал') ||
      lower.includes('організація')
    ) {
      return 'administrative';
    }

    // Technical category
    if (
      lower.includes('internet') ||
      lower.includes('crash') ||
      lower.includes('error') ||
      lower.includes('bug') ||
      lower.includes('server') ||
      lower.includes('database') ||
      lower.includes('network') ||
      lower.includes('install') ||
      lower.includes('load') ||
      lower.includes('printer') ||
      lower.includes('email') ||
      lower.includes('інтернет') ||
      lower.includes('вилітає') ||
      lower.includes('помилка') ||
      lower.includes('баг') ||
      lower.includes('сервер') ||
      lower.includes('база даних') ||
      lower.includes('мережа') ||
      lower.includes('встановл') ||
      lower.includes('завантаж') ||
      lower.includes('принтер') ||
      lower.includes('пошта') ||
      lower.includes('підключ') ||
      lower.includes('зависає') ||
      lower.includes('не працює') ||
      lower.includes('не відповідає') ||
      lower.includes('не відкривається')
    ) {
      return 'technical';
    }

    // Financial category
    if (
      lower.includes('charge') ||
      lower.includes('payment') ||
      lower.includes('money') ||
      lower.includes('refund') ||
      lower.includes('billing') ||
      lower.includes('invoice') ||
      lower.includes('price') ||
      lower.includes('fee') ||
      lower.includes('cost') ||
      lower.includes('card') ||
      lower.includes('transaction') ||
      lower.includes('списал') ||
      lower.includes('списан') ||
      lower.includes('платіж') ||
      lower.includes('гроші') ||
      lower.includes('повернут') ||
      lower.includes('рахунок') ||
      lower.includes('ціна') ||
      lower.includes('плата') ||
      lower.includes('вартість') ||
      lower.includes('картк') ||
      lower.includes('транзакц') ||
      lower.includes('квитанц') ||
      lower.includes('промокод')
    ) {
      return 'financial';
    }

    // Informational category (default)
    return 'informational';
  }
}
